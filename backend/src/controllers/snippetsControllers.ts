import Snippet from '../models/Snippet';
import { Request, Response } from 'express';
import { validateSnippet } from '../utils/validateSnippet';

export async function createSnippet(req: Request, res: Response) {
    try {

        // Validate request body
        const check = validateSnippet(req.body);
        if (!check.ok) return res.status(400).json({message:" Invalid snippet data", errors: check.errors})

        const {title, code, language, 
               framework, tags, summary
               } = req.body;

        // Create new snippet
        const snippet = await Snippet.create({
            userId: req.userId,
            title, 
            code, 
            language, 
            framework, 
            tags,
            summary
        });

        res.status(201).json(snippet);

    } catch (error) {
        console.error('Error in createSnippet', error);
        res.status(500).json({message: 'Failed to create snippet'});
    }
}

export async function getAllSnippets(req: Request, res: Response) {
    try {
        const {q, tag} = req.query;
        const page = parseInt(String(req.query.page ?? '1'), 10);
        const limit = parseInt(String(req.query.limit ?? '20'), 10)

        const query: any = {userId: req.userId};

        if (typeof tag === 'string') {
            query.tags = tag;
        }

        if (typeof q === 'string' && q.trim()) {
            const regex = new RegExp(q, 'i');
            query.$or = [
                {title: regex},
                {code: regex}
            ]
        }

        const snippets = await Snippet
        .find(query)
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

        res.status(200).json({snippets})
    } catch (error) {
        console.error('Error in getAllSnippets', error);
        res.status(500).json({message: 'Failed to fetch snippets'});
    }
}


export async function getSnippetById(req: Request, res: Response) {
    try {
        const snippet = await Snippet.findOne(
            {_id: req.params.id, userId: req.userId}
        );

        if (!snippet) return res.status(404).json({message: 'Snippet not found'});
        res.status(200).json(snippet);

    } catch (error) {
        console.error('Error in getSnippetById:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export async function updateSnippet(req: Request, res: Response) {
    try {
        const check = validateSnippet(req.body);
        if (!check.ok) return res.status(400).json({message:" Invalid snippet data", errors: check.errors});
        const {title, code, language, 
               framework, tags, summary
              } = req.body;

        const updatedSnippet = await Snippet.findOneAndUpdate(
            {_id: req.params.id, userId: req.userId},
            {title, code, language, framework, tags, summary}, 
            {new: true});

        if (!updatedSnippet) return res.status(404).json({message: 'Snippet not found'});

        res.status(200).json(updatedSnippet)

    } catch (error) {
        console.error('Error in updateSnippet:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}


export async function deleteSnippet(req: Request, res: Response) {
    try {
        const deletedSnippet = await Snippet.findOneAndDelete({_id: req.params.id, userId: req.userId});
        if (!deletedSnippet) return res.status(404).json({message: "Snippet not found"});

        return res.status(204).json(deletedSnippet);
    } catch (error) {
        console.error("Error in deleteSnippet ", error);
        res.status(500).json({message: "Internal server error"})
    }
}