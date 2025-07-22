import { Request, Response } from 'express';
import authService from '../services/authService';
import { AuthError, ValidationError, NotFoundError } from '../lib/errors';
import dotenv from 'dotenv';

dotenv.config();

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
    const { token, refreshToken, safeUser } = await authService.loginUser(req.body);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Frontend is on vercel, backend in on heroku
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.json({ token, safeUser });
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

export async function validateRefreshToken(req: Request, res: Response) {
    try {
        // Find refreshToken
        const  { newToken, newRefreshToken } = await authService.validateRefreshToken(req.cookies.refreshToken);
        
        // Set refresh token
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly:true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ token: newToken });

    } catch (error) {
        if (error instanceof AuthError) return res.status(401).json({message: "Invalid or expired refresh token"});
        
        console.error("Error in refresh token", error);
        return res.status(500).json({message: "Internal server error"})
    }

}

export async function getUserInfo(req: Request, res: Response) {
    try {
        const userInfo = await authService.getUserData(req.userId as string);

        return res.json({userInfo});
    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({message:"User not found"});
        
        console.error("Error in getUserInfo", error);
        return res.status(500).json({message: "Internal server error"});
    }
}
