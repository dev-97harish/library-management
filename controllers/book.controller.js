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
      error,
    });
  }
};

const assignBook = async (req, res) => {
  try {
    const book = await Books.findById(req.params.bookId);
    const user = await Books.findById(req.body.assigneeId);

    if (!book || !user) {
      return res.status(404).send('Book or User not found');
    }

    if (book) {
      if (req.body.action === 1) {
        const updatedBook = await Books.findOneAndUpdate({ _id: book._id }, {
          assigneeId: req.body.assigneeId,
          assignedDate: new Date(),
        }, { new: true });
        book.history.push({ user: req.body.assigneeId, action: 1 });
        book.save();
        return res.status(200).json({
          data: updatedBook,
          message: 'Book assigned!',
        });
      }
      if (req.body.action === 0) {
        const updatedBook = await Books.findOneAndUpdate({ _id: book._id }, {
          assigneeId: null,
          assignedDate: new Date(),
          history: [...book.history, { user: req.body.assigneeId, action: 0 }],
        }, { new: true });

        return res.status(200).json({
          data: updatedBook,
          message: 'Book unsassigned!',
        });
      }
      return res.status(200).json({
        message: 'Enter valid status unsassigned!',
      });
    }

    return res.status(202).json({
      message: 'Book not found',
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.size, 10) || 10;
    const skip = (page - 1) * limit;

    const matchStage = {
      $match: {
      },
    };
    if (req.query.name) {
      matchStage.$match.name = req.query.name;
    }
    if (req.query.assignedDate) {
      matchStage.$match.assignedDate = req.query.assignedDate;
    }

    const books = await Books.aggregate([
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'assigneeId',
          as: 'assigneeId',
        },
      },
      matchStage,
      {
        $facet: {
          metadata: [{ $count: 'total' }, { $addFields: { page } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },

    ]);

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
      error,
    });
  }
};

const getBooksById = async (req, res) => {
  try {
    const book = await Books.findById(req.params.id).populate('assigneeId', '_id firstName lastName');
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
      error,
    });
  }
};

export {
  assignBook, createBook, getBooks, getBooksById,
};
