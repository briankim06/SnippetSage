import express from 'express';
import { createSnippet, getAllSnippets, getSnippetById, updateSnippet, deleteSnippet } from '../controllers/snippetsControllers';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.get('/', checkAuth, getAllSnippets);
router.post('/', checkAuth, createSnippet);
router.post('/:id', checkAuth, getSnippetById);
router.patch('/:id', checkAuth, updateSnippet);
router.delete('/:id', checkAuth, deleteSnippet);


export default router;