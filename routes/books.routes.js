import express from 'express';

import {
  createBook, getBooks, assignBook, getBooksById,
} from '../controllers/book.controller';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const bookRouter = express.Router();

bookRouter.get('/', verifyToken, isAdmin, getBooks);
bookRouter.get('/:id', verifyToken, isAdmin, getBooksById);
bookRouter.post('/create', verifyToken, isAdmin, createBook);
bookRouter.post('/assign/:id', verifyToken, isAdmin, assignBook);

export default bookRouter;
