import express from 'express';
import {loginUser } from '../controllers/loginControllers';

const router = express.Router();

router.post('/', loginUser);


export default router;