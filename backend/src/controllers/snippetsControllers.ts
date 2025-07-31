import { Request, Response } from 'express';
import snippetService from '../services/snippetService';
import { ValidationError, NotFoundError } from '../lib/errors';

export async function createSnippet(req: Request, res: Response) {
  try {

    const snippet = await snippetService.createSnippet(req.userId as string, req.body);
    res.status(201).json(snippet);

  } catch (error) {

    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }

    console.error('Error in createSnippet', error);
    res.status(500).json({ message: 'Failed to create snippet' });
  }
}

export async function getAllSnippets(req: Request, res: Response) {
  try {

    const snippetsData = await snippetService.getAllSnippets(req.userId as string, req.query);
    res.status(200).json(snippetsData);

  } catch (error) {

    console.error('Error in getAllSnippets', error);
    res.status(500).json({ message: 'Failed to fetch snippets' });
  }
}

export async function semanticSearch(req: Request, res: Response) {
  try {
    
    const snippetsData = await snippetService.semanticSearch(req.userId as string, req.query);
    res.status(200).json(snippetsData);

  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({message: error.message, errors: error.errors});
    }

    console.error('Error in semanticSearch', error);
    res.status(500).json({message: 'Failed to search snippets'});
  }
}

export async function getSnippetById(req: Request, res: Response) {
  try {

    const snippet = await snippetService.getSnippetById(req.userId as string, req.params.id);
    res.status(200).json(snippet);

  } catch (error) {

    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    console.error('Error in getSnippetById:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateSnippet(req: Request, res: Response) {
  try {

    const updatedSnippet = await snippetService.updateSnippet(req.userId as string, req.params.id, req.body);
    res.status(200).json(updatedSnippet);

  } catch (error) {

    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }

    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    console.error('Error in updateSnippet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteSnippet(req: Request, res: Response) {
  try {

    await snippetService.deleteSnippet(req.userId as string, req.params.id);
    res.status(204).send();

  } catch (error) {

    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    
    console.error("Error in deleteSnippet ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}