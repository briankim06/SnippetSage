import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { createUser } from './registerControllers';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

jest.mock('../models/User');
jest.mock('bcryptjs');

const mockUser = User as jest.Mocked<typeof User>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('createUser', () => {
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

  it('should create a user successfully', async () => {
    (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    mockUser.create.mockResolvedValue({ _id: 'user123', email: 'test@example.com' } as any);

    await createUser(req as Request, res as Response);

    expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(mockUser.create).toHaveBeenCalledWith({ email: 'test@example.com', passwordHash: 'hashed' });
    // No status set, so default 200
  });

  it('should return 400 if email already exists', async () => {
    (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    const error: any = new Error('Duplicate');
    error.code = 11000;
    mockUser.create.mockRejectedValue(error);

    await createUser(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Email already exists' });
  });

  it('should return 400 for validation errors', async () => {
    (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    const error: any = new Error('Validation');
    error.name = 'ValidationError';
    error.errors = { email: { message: 'Invalid email' } };
    mockUser.create.mockRejectedValue(error);

    await createUser(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'Invalid email or password',
      errors: ['Invalid email']
    });
  });

  it('should return 500 for other errors', async () => {
    (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    mockUser.create.mockRejectedValue(new Error('Other error'));

    await createUser(req as Request, res as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});