import { Request, Response } from 'express';
import {
  createSnippet,
  getAllSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
} from './snippetsControllers';
import snippetService from '../services/snippetService';
import { ValidationError, NotFoundError } from '../lib/errors';

jest.mock('../services/snippetService');

const mockSnippetService = snippetService as jest.Mocked<typeof snippetService>;

describe('Snippets Controllers', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockSend: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockJson = jest.fn();
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson, send: mockSend });

    mockReq = {
      userId: 'user123',
      body: {},
      query: {},
      params: {},
    };

    mockRes = {
      status: mockStatus,
      json: mockJson,
    };
  });

  describe('createSnippet', () => {
    it('should call snippetService.createSnippet and return 201', async () => {
      const snippet = { title: 'New Snippet' };
      mockSnippetService.createSnippet.mockResolvedValue(snippet as any);

      await createSnippet(mockReq as Request, mockRes as Response);

      expect(mockSnippetService.createSnippet).toHaveBeenCalledWith(mockReq.userId, mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(snippet);
    });

    it('should handle validation errors from the service and return 400', async () => {
      const error = new ValidationError(['Invalid title']);
      mockSnippetService.createSnippet.mockRejectedValue(error);

      await createSnippet(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: error.message, errors: error.errors });
    });
  });

  describe('getSnippetById', () => {
    it('should call snippetService.getSnippetById and return 200', async () => {
      mockReq.params = { id: 'snippet123' };
      const snippet = { title: 'Found Snippet' };
      mockSnippetService.getSnippetById.mockResolvedValue(snippet as any);

      await getSnippetById(mockReq as Request, mockRes as Response);

      expect(mockSnippetService.getSnippetById).toHaveBeenCalledWith(mockReq.userId, 'snippet123');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(snippet);
    });

    it('should handle not found errors from the service and return 404', async () => {
      const error = new NotFoundError('Snippet not found');
      mockSnippetService.getSnippetById.mockRejectedValue(error);

      await getSnippetById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('updateSnippet', () => {
    it('should call snippetService.updateSnippet and return 200', async () => {
      mockReq.params = { id: 'snippet123' };
      const updatedSnippet = { title: 'Updated Snippet' };
      mockSnippetService.updateSnippet.mockResolvedValue(updatedSnippet as any);

      await updateSnippet(mockReq as Request, mockRes as Response);

      expect(mockSnippetService.updateSnippet).toHaveBeenCalledWith(mockReq.userId, 'snippet123', mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(updatedSnippet);
    });

    it('should handle validation errors and return 400', async () => {
        const error = new ValidationError(['Invalid data']);
        mockSnippetService.updateSnippet.mockRejectedValue(error);
  
        await updateSnippet(mockReq as Request, mockRes as Response);
  
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ message: error.message, errors: error.errors });
    });

    it('should handle not found errors and return 404', async () => {
        const error = new NotFoundError('Snippet not found');
        mockSnippetService.updateSnippet.mockRejectedValue(error);
  
        await updateSnippet(mockReq as Request, mockRes as Response);
  
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('deleteSnippet', () => {
    it('should call snippetService.deleteSnippet and return 204', async () => {
      mockReq.params = { id: 'snippet123' };
      mockSnippetService.deleteSnippet.mockResolvedValue();

      await deleteSnippet(mockReq as Request, mockRes as Response);

      expect(mockSnippetService.deleteSnippet).toHaveBeenCalledWith(mockReq.userId, 'snippet123');
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockSend).toHaveBeenCalled();
    });

    it('should handle not found errors and return 404', async () => {
      const error = new NotFoundError('Snippet not found');
      mockSnippetService.deleteSnippet.mockRejectedValue(error);

      await deleteSnippet(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: error.message });
    });
  });
}); 