import express from 'express';
import { createSnippet, getAllSnippets, getSnippetById, updateSnippet, deleteSnippet } from '../controllers/snippetsControllers';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.get('/search', checkAuth, getAllSnippets);
router.get('/:id', checkAuth, getSnippetById);
router.post('/', checkAuth, createSnippet);
router.patch('/:id', checkAuth, updateSnippet);
router.delete('/:id', checkAuth, deleteSnippet);


export default router;