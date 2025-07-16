import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function loginUser(req: Request, res: Response) {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) return res.status(401).json({message: 'Invalid credentials'});
        
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({message: 'Invalid credentials'});
        
        if (!process.env.JWT_SECRET) return res.status(500).json({message: "JWT_SECRET is not set"});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        
        res.json({token});


    } catch (error) {
        
    }
}