import Snippet from '../models/Snippet';
import { Request, Response } from 'express';

export async function createSnippet(req: Request, res: Response) {
    try {
        const {userId, title, code, language, framework, description, tags} = req.body;
        const snippet = new Snippet({
            userId,
            title, 
            code, 
            language, 
            framework, 
            description, 
            tags
        });
        const savedSnippet = await snippet.save();
        res.status(201).json(savedSnippet);
    } catch (error) {
        console.error('Error creating snippet:', error);
        res.status(500).json({message: 'Failed to create snippet'});
    }
}