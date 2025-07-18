import { Request, Response } from 'express';
import { registerUser, loginUser } from './authController';
import authService from '../services/authService';
import { AuthError, ValidationError } from '../lib/errors';

jest.mock('../services/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

describe('authController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: { email: 'test@example.com', password: 'password123' } };
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    res = { status: mockStatus, json: mockJson };
  });

  describe('registerUser', () => {
    it('should create a user and return 201', async () => {
      const user = { _id: 'user123', email: 'test@example.com', toObject: () => ({ _id: 'user123', email: 'test@example.com' }) };
      mockAuthService.registerUser.mockResolvedValue(user as any);
      await registerUser(req as Request, res as Response);
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(req.body);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({ _id: 'user123', email: 'test@example.com' });
    });
    it('should return 400 on ValidationError', async () => {
      mockAuthService.registerUser.mockRejectedValue(new ValidationError({}));
      await registerUser(req as Request, res as Response);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid data provided', errors: {} });
    });
    it('should return 409 on AuthError', async () => {
      mockAuthService.registerUser.mockRejectedValue(new AuthError('Email already exists'));
      await registerUser(req as Request, res as Response);
      expect(mockStatus).toHaveBeenCalledWith(409);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Email already exists' });
    });
    it('should return 500 for other errors', async () => {
      mockAuthService.registerUser.mockRejectedValue(new Error('Something went wrong'));
      await registerUser(req as Request, res as Response);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('loginUser', () => {
    it('should login successfully and return a token', async () => {
      mockAuthService.loginUser.mockResolvedValue({token:'test-token', refreshToken:'test-refresh-token'});
      await loginUser(req as Request, res as Response);
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(req.body);
      expect(mockJson).toHaveBeenCalledWith({ token: 'test-token' });
    });
    it('should return 401 on AuthError', async () => {
      mockAuthService.loginUser.mockRejectedValue(new AuthError('Invalid credentials'));
      await loginUser(req as Request, res as Response);
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
    it('should return 400 on ValidationError', async () => {
      mockAuthService.loginUser.mockRejectedValue(new ValidationError({}));
      await loginUser(req as Request, res as Response);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid data provided' });
    });
    it('should return 500 for other errors', async () => {
      mockAuthService.loginUser.mockRejectedValue(new Error('Something went wrong'));
      await loginUser(req as Request, res as Response);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
}); 