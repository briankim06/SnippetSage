import express from 'express';
import { createSnippet } from '../controllers/snippetsControllers';

const router = express.Router();

router.post('/', createSnippet);



export default router;