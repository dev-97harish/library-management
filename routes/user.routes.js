import express from 'express';
import {
  login, register, updateUser, deleteUser, uploadImage, getUsers,
} from '../controllers/user.controller';
import { verifyToken } from '../middleware/authMiddleware';

const userRouter = express.Router();

const {
  signUpUserValidation,
  loginUserValidation,
  updateUserValidation,
} = require('../validators/user.validator');

userRouter.get('/users', getUsers);

userRouter.post('/login', loginUserValidation, login);
userRouter.post('/register', signUpUserValidation, register);
userRouter.put(
  '/:id',
  verifyToken,
  updateUserValidation,
  updateUser,
);

userRouter.put('/profile/:id', verifyToken, uploadImage);
userRouter.delete('/delete/:userId', deleteUser);

export default userRouter;
