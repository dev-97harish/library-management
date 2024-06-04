import express from 'express';

import {
  createBook, getBooks, assignBook, getBooksById,
} from '../controllers/book.controller';

const bookRouter = express.Router();

bookRouter.get('/', getBooks);
bookRouter.get('/:id', getBooksById);
bookRouter.post('/', createBook);
bookRouter.post('/assign/:bookId', assignBook);

export default bookRouter;
