import express from 'express';
import { hasManageBookAccess, verifyToken } from '../middleware/authMiddleware';
import userRouter from './user.routes';
import bookRouter from './books.routes';

const router = express.Router();

router.use('/user', userRouter);
router.use('/books', verifyToken, hasManageBookAccess, bookRouter);

export default router;
