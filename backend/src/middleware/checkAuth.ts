import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {

    // 1. Get authorization header from request
    const authHeader = req.headers.authorization;

    // 2. Check if authorization header starts with 'Bearer '
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // 3. Extract token from auth header
    const token = authHeader.split(' ')[1];
    
    // 4. Verify token
    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'JWT_SECRET is not set' });
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as {id: string};
        req.userId = payload.id;
        next();
    } catch (error: any) {
        res.status(401).json({message: 'Unauthorized'});
    }


}