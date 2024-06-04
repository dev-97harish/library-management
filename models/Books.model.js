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
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  assignedDate: {
    type: Date,
    required: false,
  },
  isAssigned: {
    type: 'boolean',
    default: false,
  },
  history: [new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    action: { type: Number, enum: [0, 1], required: true },
    date: { type: Date, default: Date.now },
  })],
}, {
  timestamps: true,
});

const Books = mongoose.model('books', BookSchema);

export default Books;
