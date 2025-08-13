import { Request, Response } from 'express';
import aiService from '../services/aiService';

export async function explainCode(req: Request, res: Response) {
    try {
        const explanation = await aiService.explainCode(req.body.code);
        return res.json({explanation})
    } catch (error) {
        console.error('Error in explainCode', error);
        return res.status(500).json({message: 'Error in explainCode controller'})
    }
}

export async function translateCode(req: Request, res: Response) {
    try {
        const translatedCode = await aiService.translateCode(req.body.code, req.body.targetLanguage, req.body.sourceLanguage)
        return res.json({translatedCode});
    } catch (error) {
        console.error('Error in translateCode', error);
        return res.status(500).json({message: 'error in translateCode controller'})
    }
}