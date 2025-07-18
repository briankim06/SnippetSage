import snippetService from './snippetService';
import Snippet from '../models/Snippet';
import { validateSnippet } from '../utils/validateSnippet';
import { ValidationError, NotFoundError } from '../lib/errors';

jest.mock('../models/Snippet');
jest.mock('../utils/validateSnippet');

const mockSnippet = Snippet as jest.Mocked<typeof Snippet>;
const mockValidateSnippet = validateSnippet as jest.MockedFunction<typeof validateSnippet>;

describe('SnippetService', () => {
  const userId = 'user123';
  const snippetId = 'snippet123';
  const snippetData = { title: 'Test', code: 'console.log("test")' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSnippet', () => {
    it('should create a snippet if validation passes', async () => {
      mockValidateSnippet.mockReturnValue({ ok: true });
      mockSnippet.create.mockResolvedValue({ ...snippetData, userId } as any);

      const result = await snippetService.createSnippet(userId, snippetData);

      expect(mockValidateSnippet).toHaveBeenCalledWith(snippetData);
      expect(mockSnippet.create).toHaveBeenCalledWith({ ...snippetData, userId });
      expect(result).toMatchObject(snippetData);
    });

    it('should throw ValidationError if validation fails', async () => {
      mockValidateSnippet.mockReturnValue({ ok: false, errors: ['Validation failed'] });

      await expect(snippetService.createSnippet(userId, snippetData)).rejects.toThrow(ValidationError);
    });
  });

  describe('getSnippetById', () => {
    it('should return a snippet if found', async () => {
      mockSnippet.findOne.mockResolvedValue({ ...snippetData, userId } as any);

      const result = await snippetService.getSnippetById(userId, snippetId);

      expect(mockSnippet.findOne).toHaveBeenCalledWith({ _id: snippetId, userId });
      expect(result).toMatchObject(snippetData);
    });

    it('should throw NotFoundError if snippet is not found', async () => {
      mockSnippet.findOne.mockResolvedValue(null);

      await expect(snippetService.getSnippetById(userId, snippetId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateSnippet', () => {
    it('should update a snippet if found and validation passes', async () => {
      mockValidateSnippet.mockReturnValue({ ok: true });
      mockSnippet.findOneAndUpdate.mockResolvedValue({ ...snippetData, title: 'Updated' } as any);

      const result = await snippetService.updateSnippet(userId, snippetId, { title: 'Updated' });

      expect(mockSnippet.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: snippetId, userId },
        { title: 'Updated' },
        { new: true }
      );
      expect(result.title).toBe('Updated');
    });

    it('should throw ValidationError if validation fails', async () => {
      mockValidateSnippet.mockReturnValue({ ok: false, errors: ['Validation failed'] });

      await expect(snippetService.updateSnippet(userId, snippetId, snippetData)).rejects.toThrow(ValidationError);
    });

    it('should throw NotFoundError if snippet to update is not found', async () => {
      mockValidateSnippet.mockReturnValue({ ok: true });
      mockSnippet.findOneAndUpdate.mockResolvedValue(null);

      await expect(snippetService.updateSnippet(userId, snippetId, snippetData)).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteSnippet', () => {
    it('should delete a snippet if found', async () => {
      mockSnippet.findOneAndDelete.mockResolvedValue({} as any); // Return a dummy object

      await expect(snippetService.deleteSnippet(userId, snippetId)).resolves.not.toThrow();
      expect(mockSnippet.findOneAndDelete).toHaveBeenCalledWith({ _id: snippetId, userId });
    });

    it('should throw NotFoundError if snippet to delete is not found', async () => {
      mockSnippet.findOneAndDelete.mockResolvedValue(null);

      await expect(snippetService.deleteSnippet(userId, snippetId)).rejects.toThrow(NotFoundError);
    });
  });
}); 