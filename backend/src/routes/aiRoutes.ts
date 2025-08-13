import express from 'express';
import { explainCode, translateCode } from '../controllers/aiControllers';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.post('/explain', checkAuth, explainCode);
router.post('/translate', checkAuth, translateCode);

export default router