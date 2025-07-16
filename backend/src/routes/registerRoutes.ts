import express from 'express';
import { createUser } from '../controllers/registerControllers';

const router = express.Router();

router.post('/', createUser);



export default router;