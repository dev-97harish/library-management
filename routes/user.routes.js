import express from 'express';
import {
  login, autoLogin, register, updateUser, deleteUser, uploadImage, getUsers,
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
userRouter.post('/autoLogin/:userId', autoLogin);
userRouter.post('/register', signUpUserValidation, register);
userRouter.put(
  '/update-details/:id',
  verifyToken,
  updateUserValidation,
  updateUser,
);

userRouter.put('/update-image/:id', verifyToken, uploadImage);
userRouter.delete('/delete/:userId', deleteUser);

export default userRouter;
