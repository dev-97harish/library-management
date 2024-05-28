import Books from '../models/Books.model';
import { STATUS_TYPE } from '../utils/constants';

const createBook = async (req, res) => {
  try {
    const books = await Books.create({ ...req.body });
    if (books) {
      return res.status(200).json({
        data: {
          book_id: books._id,
        },
        message: 'Book Created!',
      });
    }
    return res.status(202).json({
      message: 'Can not Create Book!',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

const assignBook = async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);
    if (book) {
      await Books.findOneAndUpdate({ _id: book._id }, {
        assignee: req.body.assignee,
        assignedDate: new Date(),
      }, { new: true });
      return res.status(200).json({
        data: book,
        message: 'Book assigned!',
      });
    }
    return res.status(202).json({
      message: 'Can not Create Book!',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Books.find().populate('assignee', '_id firstName lastName');
    if (books) {
      return res.status(200).json({
        message: 'Book data found',
        books,
      });
    }
    return res.status(STATUS_TYPE.NOT_FOUND.statusCode).json({
      message: STATUS_TYPE.NOT_FOUND.message,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

const getBooksById = async (req, res) => {
  try {
    const book = await Books.findById(req.params.id).populate('assignee', '_id firstName lastName');
    if (book) {
      return res.status(200).json({
        message: 'Book data found',
        book,
      });
    }
    return res.status(STATUS_TYPE.NOT_FOUND.statusCode).json({
      message: STATUS_TYPE.NOT_FOUND.message,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

export {
  assignBook, createBook, getBooks, getBooksById,
};
