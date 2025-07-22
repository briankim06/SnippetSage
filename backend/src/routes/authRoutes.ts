import express from 'express';
import { registerUser, loginUser, validateRefreshToken, getUserInfo} from '../controllers/authController';
import { checkAuth } from '../middleware/checkAuth'


const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/refresh', validateRefreshToken);
router.get('/me', checkAuth, getUserInfo)


export default router;