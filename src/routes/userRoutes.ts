import { login, updateUser, me, logout } from '../controllers/userController';
import { Router } from 'express';
import { userAuth } from '../services/middleware/userAuth';

export const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.patch('/:userId', userAuth, updateUser);
router.post('/me', userAuth, me);
