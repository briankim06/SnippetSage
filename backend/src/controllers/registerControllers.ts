import User from '../models/User';
import {Response, Request} from 'express';
import bcrypt from 'bcryptjs';

export async function createUser(req: Request, res: Response) {
    try {
        const {email, password} = req.body;

        // Hash password via bcrypt, 10 salt rounds
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({email, passwordHash});
        res.status(201).json
    } catch (error: any ) {
        if (error.code === 11000) {
            return res.status(400).json({
                error: 'Email already exists'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Invalid email or password',
                errors: Object.values(error.errors).map((err: any) => err.message)
            })
        }

        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}