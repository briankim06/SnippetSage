import dotenv from 'dotenv';
import { Request, Response } from 'express';
import {
  createSnippet,
  getAllSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet
} from './snippetsControllers';
import Snippet from '../models/Snippet';
import { validateSnippet } from '../utils/validateSnippet';

// Load environment variables
dotenv.config();

// Mock dependencies
jest.mock('../models/Snippet');
jest.mock('../utils/validateSnippet');

const mockSnippet = Snippet as jest.Mocked<typeof Snippet>;
const mockValidateSnippet = validateSnippet as jest.MockedFunction<typeof validateSnippet>;

describe('Snippets Controllers', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup mock response methods
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    // Setup mock request and response objects
    mockReq = {
      userId: 'user123',
      body: {},
      query: {},
      params: {}
    };
    
    mockRes = {
      status: mockStatus,
      json: mockJson
    };
  });

  describe('createSnippet', () => {
    const validSnippetData = {
      title: 'Test Snippet',
      code: 'console.log("hello world")',
      language: 'javascript',
      framework: 'node',
      tags: ['test', 'example'],
      summary: 'A test snippet'
    };

    beforeEach(() => {
      mockReq.body = validSnippetData;
    });

    it('should create a snippet successfully', async () => {
      const createdSnippet = { _id: 'snippet123', userId: 'user123', ...validSnippetData };
      
      mockValidateSnippet.mockReturnValue({ ok: true });
      mockSnippet.create.mockResolvedValue(createdSnippet as any);

      await createSnippet(mockReq as Request, mockRes as Response);

      expect(mockValidateSnippet).toHaveBeenCalledWith(validSnippetData);
      expect(mockSnippet.create).toHaveBeenCalledWith({
        userId: 'user123',
        ...validSnippetData
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(createdSnippet);
    });

    it('should return 400 when validation fails', async () => {
      const validationErrors = ['Title is required', 'Code cannot be empty'];
      
      mockValidateSnippet.mockReturnValue({ 
        ok: false, 
        errors: validationErrors 
      });

      await createSnippet(mockReq as Request, mockRes as Response);

      expect(mockValidateSnippet).toHaveBeenCalledWith(validSnippetData);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: ' Invalid snippet data',
        errors: validationErrors
      });
    });

    it('should handle database errors', async () => {
      mockValidateSnippet.mockReturnValue({ ok: true });
      mockSnippet.create.mockRejectedValue(new Error('Database error'));

      await createSnippet(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Failed to create snippet'
      });
    });
  });

  describe('getAllSnippets', () => {
    beforeEach(() => {
      mockReq.query = {};
    });

    it('should fetch all snippets for user with default pagination', async () => {
      const snippets = [
        { _id: 'snippet1', title: 'Snippet 1', userId: 'user123' },
        { _id: 'snippet2', title: 'Snippet 2', userId: 'user123' }
      ];

      mockSnippet.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue(snippets)
            })
          })
        })
      } as any);

      await getAllSnippets(mockReq as Request, mockRes as Response);

      expect(mockSnippet.find).toHaveBeenCalledWith({ userId: 'user123' });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ snippets });
    });

    it('should handle search query', async () => {
      mockReq.query = { q: 'test' };

      mockSnippet.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue([])
            })
          })
        })
      } as any);

      await getAllSnippets(mockReq as Request, mockRes as Response);

      expect(mockSnippet.find).toHaveBeenCalledWith({
        userId: 'user123',
        $or: [
          { title: /test/i },
          { code: /test/i }
        ]
      });
    });

    it('should handle tag filter', async () => {
      mockReq.query = { tag: 'javascript' };

      mockSnippet.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue([])
            })
          })
        })
      } as any);

      await getAllSnippets(mockReq as Request, mockRes as Response);

      expect(mockSnippet.find).toHaveBeenCalledWith({
        userId: 'user123',
        tags: 'javascript'
      });
    });

    it('should handle custom pagination', async () => {
      mockReq.query = { page: '2', limit: '10' };

      mockSnippet.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue([])
            })
          })
        })
      } as any);

      await getAllSnippets(mockReq as Request, mockRes as Response);

      expect(mockSnippet.find).toHaveBeenCalledWith({ userId: 'user123' });
    });

    it('should handle database errors', async () => {
      mockSnippet.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockRejectedValue(new Error('Database error'))
            })
          })
        })
      } as any);

      await getAllSnippets(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Failed to fetch snippets'
      });
    });
  });

  describe('getSnippetById', () => {
    beforeEach(() => {
      mockReq.params = { id: 'snippet123' };
    });

    it('should fetch snippet by id successfully', async () => {
      const snippet = { 
        _id: 'snippet123', 
        title: 'Test Snippet', 
        userId: 'user123' 
      };

      mockSnippet.findOne.mockResolvedValue(snippet);

      await getSnippetById(mockReq as Request, mockRes as Response);

      expect(mockSnippet.findOne).toHaveBeenCalledWith({
        _id: 'snippet123',
        userId: 'user123'
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(snippet);
    });

    it('should return 404 when snippet not found', async () => {
      mockSnippet.findOne.mockResolvedValue(null);

      await getSnippetById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Snippet not found'
      });
    });

    it('should handle database errors', async () => {
      mockSnippet.findOne.mockRejectedValue(new Error('Database error'));

      await getSnippetById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('updateSnippet', () => {
    const updateData = {
      title: 'Updated Snippet',
      code: 'console.log("updated")',
      language: 'javascript',
      framework: 'node',
      tags: ['updated'],
      summary: 'Updated summary'
    };

    beforeEach(() => {
      mockReq.params = { id: 'snippet123' };
      mockReq.body = updateData;
    });

    it('should update snippet successfully', async () => {
      const updatedSnippet = { 
        _id: 'snippet123', 
        userId: 'user123', 
        ...updateData 
      };

      mockValidateSnippet.mockReturnValue({ ok: true });
      mockSnippet.findOneAndUpdate.mockResolvedValue(updatedSnippet);

      await updateSnippet(mockReq as Request, mockRes as Response);

      expect(mockValidateSnippet).toHaveBeenCalledWith(updateData);
      expect(mockSnippet.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'snippet123', userId: 'user123' },
        updateData,
        { new: true }
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(updatedSnippet);
    });

    it('should return 400 when validation fails', async () => {
      const validationErrors = ['Title is required'];
      
      mockValidateSnippet.mockReturnValue({ 
        ok: false, 
        errors: validationErrors 
      });

      await updateSnippet(mockReq as Request, mockRes as Response);

      expect(mockValidateSnippet).toHaveBeenCalledWith(updateData);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: ' Invalid snippet data',
        errors: validationErrors
      });
    });

    it('should return 404 when snippet not found', async () => {
      mockValidateSnippet.mockReturnValue({ ok: true });
      mockSnippet.findOneAndUpdate.mockResolvedValue(null);

      await updateSnippet(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Snippet not found'
      });
    });

    it('should handle database errors', async () => {
      mockValidateSnippet.mockReturnValue({ ok: true });
      mockSnippet.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      await updateSnippet(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('deleteSnippet', () => {
    beforeEach(() => {
      mockReq.params = { id: 'snippet123' };
    });

    it('should delete snippet successfully', async () => {
      const deletedSnippet = { 
        _id: 'snippet123', 
        title: 'Deleted Snippet', 
        userId: 'user123' 
      };

      mockSnippet.findOneAndDelete.mockResolvedValue(deletedSnippet);

      await deleteSnippet(mockReq as Request, mockRes as Response);

      expect(mockSnippet.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'snippet123',
        userId: 'user123'
      });
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockJson).toHaveBeenCalledWith(deletedSnippet);
    });

    it('should return 404 when snippet not found', async () => {
      mockSnippet.findOneAndDelete.mockResolvedValue(null);

      await deleteSnippet(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Snippet not found'
      });
    });

    it('should handle database errors', async () => {
      mockSnippet.findOneAndDelete.mockRejectedValue(new Error('Database error'));

      await deleteSnippet(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
}); 