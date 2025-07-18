import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authService from './authService';
import { ValidationError, AuthError } from '../lib/errors';

jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockUser = User as jest.Mocked<typeof User>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should create and return a new user', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      (mockUser.create as jest.Mock).mockResolvedValue({ _id: '123', ...userData });

      const result = await authService.registerUser(userData);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUser.create).toHaveBeenCalledWith({ email: userData.email, passwordHash: 'hashedpassword' });
      expect(result).toBeDefined();
    });

    it('should throw ValidationError if email or password is not provided', async () => {
      await expect(authService.registerUser({ email: 'test@test.com' })).rejects.toThrow(ValidationError);
    });

    it('should throw AuthError if email already exists', async () => {
      (mockUser.create as jest.Mock).mockRejectedValue({ code: 11000 });
      await expect(authService.registerUser({ email: 'test@example.com', password: 'password' })).rejects.toThrow(AuthError);
    });
  });

  describe('loginUser', () => {
    beforeEach(() => {
      process.env.JWT_SECRET = 'test-secret';
    });

    it('should return a JWT token on successful login', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const user = { _id: '123', email: credentials.email, passwordHash: 'hashedpassword' };
      (mockUser.findOne as jest.Mock).mockResolvedValue(user);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockJwt.sign as jest.Mock).mockReturnValue('test-token');

      const token = await authService.loginUser(credentials);
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: credentials.email });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(credentials.password, user.passwordHash);
      expect(mockJwt.sign).toHaveBeenCalledWith({ id: user._id }, 'test-secret', { expiresIn: '1h' });
      expect(token).toBe('test-token');
    });

    it('should throw AuthError for invalid credentials if user is not found', async () => {
      (mockUser.findOne as jest.Mock).mockResolvedValue(null);
      await expect(authService.loginUser({ email: 'wrong@test.com', password: 'password' })).rejects.toThrow(AuthError);
    });

    it('should throw AuthError for invalid credentials if password does not match', async () => {
      const user = { _id: '123', passwordHash: 'hashedpassword' };
      (mockUser.findOne as jest.Mock).mockResolvedValue(user);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(authService.loginUser({ email: 'test@test.com', password: 'wrong' })).rejects.toThrow(AuthError);
    });
  });
}); 