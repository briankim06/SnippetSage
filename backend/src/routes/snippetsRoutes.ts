import express from 'express';
import { createSnippet } from '../controllers/snippetsControllers';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.post('/', checkAuth,createSnippet);



export default router;