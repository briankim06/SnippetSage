import { Request, Response } from 'express';
import authService from '../services/authService';
import { AuthError, ValidationError } from '../lib/errors';

export async function registerUser(req: Request, res: Response) {
  try {
    const user = await authService.registerUser(req.body);
    const { passwordHash, ...userResponse } = user.toObject();
    res.status(201).json(userResponse);
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: 'Invalid data provided',
        errors: error.errors,
      });
    }
    if (error instanceof AuthError) {
      return res.status(409).json({ message: error.message });
    }
    console.error('Error in registerUser:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const token = await authService.loginUser(req.body);
    res.json({ token });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    if (error instanceof AuthError) {
      return res.status(401).json({ message: error.message });
    }
    console.error('Error in loginUser:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 