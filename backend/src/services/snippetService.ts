import Snippet, { ISnippet } from '../models/Snippet';
import { validateSnippet } from '../utils/validateSnippet';
import { ValidationError, NotFoundError } from '../lib/errors';
import { redis } from '../lib/redis';
import { buildCacheKey } from '../utils/buildCacheKey';
import { isValidCachedSnippet } from '../utils/validateCachedSnippet';

type CreateSnippetData = Pick<ISnippet, 'title' | 'code'> & Partial<Omit<ISnippet, 'title' | 'code'>>;

class SnippetService {
    public async createSnippet(userId: string, snippetData: CreateSnippetData): Promise<ISnippet> {

    const check = validateSnippet(snippetData);
    if (!check.ok) throw new ValidationError(check.errors);
    
    const { title, code } = snippetData;
    if (!title || !code) throw new ValidationError({ message: 'Title and code are required' });

    const snippet = await Snippet.create({
      ...snippetData,
      userId,
    });

    
    // Invalidate search cache; must update cache to show created snippet
    const cachedSearches = await redis.keys(`snippets:${userId}:*:*:*:*`);
    if (cachedSearches.length > 0) {
      await redis.del(...cachedSearches);
    }
    
    return snippet;
  }

  public async getAllSnippets(userId: string, queryParams?: any): Promise<ISnippet[]> {
    const { q, tag, page = 1, limit = 20 } = queryParams;
    const query: any = { userId };

    if (typeof tag === 'string') {
      query.tags = tag;
    }

    // Check if query is cached in Redis
    const cacheKey = buildCacheKey(userId, queryParams);
    const cachedSnippets = await redis.get(cacheKey);
    if (cachedSnippets && Array.isArray(cachedSnippets)) {
        return cachedSnippets;
    }


    if (typeof q === 'string' && q.trim()) {
      const regex = new RegExp(q, 'i');
      query.$or = [{ title: regex }, { code: regex }];
    }

    const snippets = await Snippet.find(query)
    .select('-embeddingVector')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    // Cache resulting snippets in Redis
    await redis.set(cacheKey, snippets, {ex: 60})

    return snippets;
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
    const check = validateSnippet(snippetData);
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