import { Router } from 'express';
const router = Router();
import { getCurrentUser, login, register } from '../Controllers/user';
import { authenticate } from '../Middlewares/authenticate';
import passport from 'passport';

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getCurrentUser);

export default router;