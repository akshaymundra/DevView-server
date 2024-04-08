import { Router } from 'express';
const router = Router();
import userRoutes from './user';
import interviewRoutes from './interview';

router.use('/api', userRoutes);
router.use('/api', interviewRoutes);

export default router;