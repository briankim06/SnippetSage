import Snippet from '../models/Snippet';
import { Request, Response } from 'express';

export async function createSnippet(req: Request, res: Response) {
    try {
        const {userId, title, code, language, framework, description, tags, summary} = req.body;
        const snippet = new Snippet({
            userId,
            title, 
            code, 
            language, 
            framework, 
            description, 
            tags,
            summary
        });
        const savedSnippet = await snippet.save();
        res.status(201).json(savedSnippet);
    } catch (error) {
        console.error('Error in createSnippet', error);
        res.status(500).json({message: 'Failed to create snippet'});
    }
}

export async function getAllSnippets(req: Request, res: Response) {
    try {
        const snippets = await Snippet.find({userId: req.userId});
        res.status(200).json(snippets);

    } catch (error) {
        console.error('Error in getAllSnippets:', error);
        res.status(500).json({message: 'Internal server error'});
        
    }
}

export async function getSnippetById(req: Request, res: Response) {
    try {
        const snippet = await Snippet.findById(req.params.id);
        if (!snippet) return res.status(404).json({message: 'Snippet not found'});

        res.status(200).json(snippet);
    } catch (error) {
        console.error('Error in getSnippetById:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

export async function updateSnippet(req: Request, res: Response) {
    try {
        const {title, code, language, framework, description, tags, summary} = req.body;

        const updatedSnippet = await Snippet.findByIdAndUpdate(req.params.id, 
            {title, code, language, framework, description, tags, summary}, {new: true});
        if (!updatedSnippet) return res.status(404).json({message: 'Snippet not found'});

        res.status(200).json(updatedSnippet)

    } catch (error) {
        console.error('Error in updateSnippet:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}


export async function deleteSnippet(req: Request, res: Response) {
    try {
        const deletedSnippet = await Snippet.findByIdAndDelete(req.params.id);
        if (!deletedSnippet) return res.status(404).json({message: "Snippet not found"});

        return res.status(204).json(deletedSnippet);
    } catch (error) {
        console.error("Error in deleteSnippet ", error);
        res.status(500).json({message: "Internal server error"})
    }
}