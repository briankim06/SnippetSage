import Snippet, { ISnippet } from '../models/Snippet';
import { validateSnippet } from '../utils/validateSnippet';
import { ValidationError, NotFoundError } from '../lib/errors';

class SnippetService {
  public async createSnippet(userId: string, snippetData: Partial<ISnippet>): Promise<ISnippet> {
    const check = validateSnippet(snippetData);
    if (!check.ok) {
      throw new ValidationError(check.errors);
    }

    const snippet = await Snippet.create({
      ...snippetData,
      userId,
    });

    return snippet;
  }

  public async getAllSnippets(userId: string, queryParams: any): Promise<ISnippet[]> {
    const { q, tag, page = 1, limit = 20 } = queryParams;
    const query: any = { userId };

    if (typeof tag === 'string') {
      query.tags = tag;
    }

    if (typeof q === 'string' && q.trim()) {
      const regex = new RegExp(q, 'i');
      query.$or = [{ title: regex }, { code: regex }];
    }

    const snippets = await Snippet.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      
    return snippets;
  }

  public async getSnippetById(userId: string, snippetId: string): Promise<ISnippet> {
    const snippet = await Snippet.findOne({ _id: snippetId, userId });
    if (!snippet) {
      throw new NotFoundError('Snippet not found');
    }
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
  }
}

export default new SnippetService(); 