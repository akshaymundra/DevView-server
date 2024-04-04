import { Router } from 'express';
const router = Router();
import userRoutes from './user';

router.use('/api', userRoutes);

export default router;