import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { loginUser } from './loginControllers';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockUser = User as jest.Mocked<typeof User>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('loginUser', () => {
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
    process.env.JWT_SECRET = 'testsecret';
  });

  it('should login successfully and return a token', async () => {
    const user = { _id: 'user123', passwordHash: 'hashed' };
    mockUser.findOne.mockResolvedValue(user as any);
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
    (mockJwt.sign as jest.Mock).mockReturnValue('jwt-token');

    await loginUser(req as Request, res as Response);

    expect(mockUser.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashed');
    expect(mockJwt.sign).toHaveBeenCalledWith({ id: 'user123' }, 'testsecret', { expiresIn: '1h' });
    expect(mockJson).toHaveBeenCalledWith({ token: 'jwt-token' });
  });

  it('should return 401 if user not found', async () => {
    mockUser.findOne.mockResolvedValue(null);

    await loginUser(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should return 401 if password does not match', async () => {
    const user = { _id: 'user123', passwordHash: 'hashed' };
    mockUser.findOne.mockResolvedValue(user as any);
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

    await loginUser(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should return 500 if JWT_SECRET is not set', async () => {
    process.env.JWT_SECRET = '';
    const user = { _id: 'user123', passwordHash: 'hashed' };
    mockUser.findOne.mockResolvedValue(user as any);
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);

    await loginUser(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ message: 'JWT_SECRET is not set' });
  });

  it('should handle errors and not throw', async () => {
    mockUser.findOne.mockRejectedValue(new Error('DB error'));

    await expect(loginUser(req as Request, res as Response)).resolves.not.toThrow();
    // Optionally, check for no response or a default error response if you add one
  });
});