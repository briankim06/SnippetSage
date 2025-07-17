import express from 'express';
import { createUser } from '../controllers/registerControllers';
import {loginUser } from '../controllers/loginControllers';


const router = express.Router();


router.post('/login', loginUser);
router.post('/register', createUser);


export default router;