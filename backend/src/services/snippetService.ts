import Snippet, { ISnippet } from '../models/Snippet';
import { validateSnippet } from '../utils/validateSnippet';
import { ValidationError, NotFoundError } from '../lib/errors';
import { redis } from '../lib/redis';
import { buildCacheKey } from '../utils/buildCacheKey';
import { isValidCachedSnippet } from '../utils/validateCachedSnippet';
import { index, index as pineconeIndex } from '../config/clients';
type CreateSnippetData = Pick<ISnippet, 'title' | 'code'> & Partial<Omit<ISnippet, 'title' | 'code'>>;

class SnippetService {
    public async createSnippet(userId: string, snippetData: CreateSnippetData): Promise<ISnippet> {

    const check = validateSnippet(snippetData, true);
    if (!check.ok) throw new ValidationError(check.errors);
    
    const { title, code } = snippetData;
    if (!title || !code) throw new ValidationError({ message: 'Title and code are required' });

    const snippet = await Snippet.create({
      ...snippetData,
      userId,
    });

    // Upsert snippet into pinecone
    const namespace = index.namespace(userId);

    try {
      await namespace.upsertRecords([{
        "_id": snippet._id,
        "text": `${snippet.title} ${snippet.code} ${snippet.summary}`,
        "title": snippet.title,
        "code": snippet.code,
        "tags": snippet.tags,
        "language": snippet.language,
      }])
    } catch (error) {
      console.error('Error upserting snippet into pinecone:', error);
      throw new Error('Failed to upsert snippet into pinecone');
    }
    

    
    // Invalidate search cache; must update cache to show created snippet
    const cachedSearches = await redis.keys(`snippets:${userId}:*:*:*:*`);
    if (cachedSearches.length > 0) {
      await redis.del(...cachedSearches);
    }
    
    return snippet;
  }

  public async getAllSnippets(userId: string, queryParams?: any): Promise<{snippets: ISnippet[], totalCount: number}> {
    const { q, tag, page = 1} = queryParams;
    const query: any = { userId };


    // if (typeof tag === 'string') {
    //   query.tags = tag;
    // }

    // Check if query is cached in Redis
    const cacheKey = buildCacheKey(userId, queryParams);
    const cachedSnippets = await redis.get(cacheKey);
    if (cachedSnippets && Array.isArray(cachedSnippets)) {
        return {snippets: cachedSnippets, totalCount: cachedSnippets.length};
    }


    if (typeof q === 'string' && q.trim()) {
      const regex = new RegExp(q, 'i');
      query.$or = [{ title: regex }, { code: regex }];
    }

    const snippets = await Snippet.find(query)
    .select('-embeddingVector')
      .sort({ createdAt: -1 })
      .skip((page - 1) * 15)
      .limit(15)

    const totalCount = await Snippet.countDocuments(query);

    // Cache resulting snippets in Redis
    await redis.set(cacheKey, {snippets, totalCount}, {ex: 60});

    return {snippets, totalCount};
  }

  public async semanticSearch(userId: string, queryParams?: any): Promise<{snippets: ISnippet[], totalCount: number}> {
    
    // Deconstruct query params
    const { q } = queryParams;

    // Check if query is cached in Redis
    const cacheKey = buildCacheKey(userId, queryParams);
    const cachedStr = await redis.get<string>(cacheKey);
    if (cachedStr) {
      return JSON.parse(cachedStr) as { snippets: ISnippet[]; totalCount: number };
    }
    
    // Get namespace for user
    const namespace = index.namespace(userId);

    // Search pinecone for snippet, return the ids of the snippets, we will use these to search mongoDB for these snippets
    const { result } = await namespace.searchRecords({
      query: {
        topK: 15,
        inputs: { text: q },
      },
      fields: ['_id'],
    });

    // extract ids from pinecone results
    const ids = result.hits.map((hit) => hit._id);

    // Search mongoDB for these snippets
    const snippets = await Snippet.find({ _id: { $in: ids }})
                                  .select('-embeddingVector');

    // Order the snippets by similarity score (from pinecone)
    const snippetsById = new Map(snippets.map((s) => [s._id.toString(), s]));
    const orderedSnippets = ids.map((id) => snippetsById.get(id)).filter(Boolean) as ISnippet[];

    // Cache the results in Redis
    await redis.set(cacheKey, JSON.stringify({snippets: orderedSnippets, totalCount: orderedSnippets.length }), { ex: 60 });
    return {snippets: orderedSnippets, totalCount: orderedSnippets.length}

  }

  public async getSnippetById(userId: string, snippetId: string): Promise<ISnippet> {
    // Check if snippet is cached in Redis
    const cacheKey = buildCacheKey(userId, snippetId);
    const cachedSnippet = await redis.get(cacheKey);
    if (cachedSnippet && isValidCachedSnippet(cachedSnippet)) {
        return cachedSnippet;
    }

    const snippet = await Snippet.findOne({ _id: snippetId, userId });
    if (!snippet) {
      throw new NotFoundError('Snippet not found');
    }

    //Cache snippet in Redis
    await redis.set(cacheKey, snippet, {ex: 60});
    return snippet;
  }

  public async updateSnippet(userId: string, snippetId: string, snippetData: Partial<ISnippet>): Promise<ISnippet> {
    const check = validateSnippet(snippetData, true);
    if (!check.ok) {
      throw new ValidationError(check.errors);
    }

    const updatedSnippet = await Snippet.findOneAndUpdate(
      { _id: snippetId, userId },
      snippetData,
      { new: true }
    );

    // Invalidate individual snippet cache
    const snippetCacheKey = buildCacheKey(userId, snippetId);
    await redis.del(snippetCacheKey);
    // Invalidate search cache; must update cache to show created snippet
    const cachedSearches = await redis.keys(`snippets:${userId}:*:*:*:*`);
    await redis.del(...cachedSearches);

    if (!updatedSnippet) {
      throw new NotFoundError('Snippet not found');
    }

    return updatedSnippet;
  }

  public async deleteSnippet(userId: string, snippetId: string): Promise<void> {
    const deletedSnippet = await Snippet.findOneAndDelete({ _id: snippetId, userId });
    if (!deletedSnippet) {
      throw new NotFoundError('Snippet not found');
    }
    // Invalidate individual snippet cache
     const snippetCacheKey = buildCacheKey(userId, snippetId);
     await redis.del(snippetCacheKey);

    // Invalidate search cache; must update cache to show created snippet
    const cachedSearches = await redis.keys(`snippets:${userId}:*:*:*:*`);
    await redis.del(...cachedSearches);
  }
}

export default new SnippetService(); 