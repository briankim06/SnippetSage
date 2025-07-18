import express from 'express';
import { registerUser, loginUser, refreshToken } from '../controllers/authController';


const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/refresh', refreshToken);


export default router;