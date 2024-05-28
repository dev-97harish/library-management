const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const IMAGE_PATH = path.join('/images');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['super-admin', 'sub-admin', 'user'],
    },
    access: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      required: false,
      default: 'inactive',
      enum: ['active', 'inactive'],
    },
  },
  {
    timeStamps: true,
  },
);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '..', IMAGE_PATH));
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

// static
userSchema.statics.uploadedImage = multer({ storage }).single('image');

userSchema.statics.imagePath = IMAGE_PATH;

const User = mongoose.model('User', userSchema);

export default User;
