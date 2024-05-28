import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { STATUS_TYPE } from '../utils/constants';
import { bryptPassword } from '../utils/password.utils';
import User from '../models/User.model';

const register = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(202).json({
        message: 'User Already exist!',
      });
    }

    const hashedPassword = await bryptPassword(req.body.password);

    user = await User.create({ ...req.body, password: hashedPassword });
    if (user) {
      return res.status(200).json({
        data: {
          user_id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          role: user.role,
        },
        token: jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: '100000',
          },
        ),
        message: 'User Created!',
      });
    }
    return res.status(202).json({
      message: 'Can not Create User!',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (user) {
      const token = await jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: '24H',
        },
      );

      if (!bcrypt.compare(req.body.password, user.password)) {
        return res.status(202).json({
          message: 'Invalid Username or Password!',
        });
      }
      return res.status(200).json({
        message: 'Logged In Successfully',
        data: {
          user_id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          role: user.role,
        },
        token,
      });
    }
    return res.status(401).json({
      message: 'User Not Found!',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

const autoLogin = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    if (user) {
      return res.status(200).json({
        message: 'Logged In Successfully',
        data: {
          user_id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
        },
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

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      return res.status(200).json({
        message: 'User data found',
        users,
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

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (user) {
      return res.status(200).json({
        message: 'User Deleted',
        user,
      });
    }
    return res.status(202).json({
      message: 'Can not delete user',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.username = req.body.username;
      user.email = req.body.email;
      user.phone = req.body.phone;
      user.role = req.body.role;
      user.save();
      return res.status(200).json({
        data: {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        },
        message: 'User Updated!',
      });
    }
    return res.status(202).json({
      message: 'Can not update user details!',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

const uploadImage = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    User.uploadedImage(req, res, (err) => {
      if (err) {
        console.log('*****Multer Error: ', err);
      }
      if (req.file) {
        if (user.image) {
          fs.unlinkSync(path.join(__dirname, '../..', user.image));
        }

        // this is saving the path of the uploaded file into the avatar field in the user
        user.image = `${User.imagePath}/${req.image.filename}`;
      }
      user.save();
      return res.status(202).json({
        message: 'Image uploaded!',
      });
    });
    return res.status(202).json({
      message: 'Can not update user profile!',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

export {
  register,
  login,
  autoLogin,
  getUsers,
  deleteUser,
  updateUser,
  uploadImage,
};
