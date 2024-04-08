import { Router } from 'express';
const router = Router();
import { requestInterview } from '../Controllers/interview';
import { authenticate } from '../Middlewares/authenticate';

router.post('/interview/request', authenticate, requestInterview);

export default router;