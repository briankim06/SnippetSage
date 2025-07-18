import express from 'express';
import { registerUser } from '../controllers/authController';
import { loginUser } from '../controllers/authController';


const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);


export default router;