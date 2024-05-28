import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true,
  },
  about: {
    type: 'string',
    required: false,
  },
  author: {
    type: 'string',
    required: false,
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedDate: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    required: false,
    default: 'available',
    enum: ['available', 'booked'],
  },
}, {
  timestamps: true,
});

const Books = mongoose.model('Books', BookSchema);

export default Books;
