const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { bryptPassword } = require('../../utils/password.utils');
const path = require('path');
const fs = require('fs');
const { sendOtp } = require('../../config/nodemailer');

module.exports.register = async function (req, res) {
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
      await sendOtp();
      return res.status(200).json({
        data: {
          user_id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
        },
        token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: '100000',
        }),
        message: 'User Created!',
      });
    } else {
      return res.status(202).json({
        message: 'Can not Create User!',
      });
    }
  } catch (error) {
    console.log('Error in creating user', error);
  }
};

module.exports.login = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });

    if (user) {
      const token = await jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: '24H',
        }
      );
      const dec = await jwt.verify(token, process.env.JWT_SECRET);

      if (!bcrypt.compare(req.body.password, user.password)) {
        return res.status(202).json({
          message: 'Invalid Username or Password!',
        });
      } else {
        return res.status(200).json({
          message: 'Logged In Successfully',
          data: {
            user_id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
          },
          token,
        });
      }
    } else {
      return res.status(401).json({
        message: 'User Not Found!',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

module.exports.autoLogin = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.userId });
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
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

module.exports.users = async (req, res) => {
  try {
    let users = await User.find();
    if (users) {
      return res.status(200).json({
        message: 'User data found',
        users: users,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

module.exports.delete = async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.userId);
    if (user) {
      return res.status(200).json({
        message: 'User Deleted',
        user: user,
      });
    } else {
      return res.status(202).json({
        message: 'Can not delete user',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

module.exports.update = async function (req, res) {
  try {
    let user = await User.findOne({ _id: req.userId });
    if (user) {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.username = req.body.username;
      user.email = req.body.email;
      user.phone = req.body.phone;
      user.role = req.body.role;
      // user.password = await bryptPassword(req.body.password);
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
    } else {
      return res.status(202).json({
        message: 'Can not update user details!',
      });
    }
  } catch (error) {
    console.log('Error in creating user', error);
  }
};

module.exports.uploadImage = async function (req, res) {
  try {
    let user = await User.findById(req.userId);

    User.uploadedImage(req, res, function (err) {
      if (err) {
        console.log('*****Multer Error: ', err);
      }
      console.log(req, user.image);

      if (req.file) {
        if (user.image) {
          fs.unlinkSync(path.join(__dirname, '../..', user.image));
        }

        // this is saving the path of the uploaded file into the avatar field in the user
        user.image = User.imagePath + '/' + req.image.filename;
      }
      console.log(user.image);
      user.save();
      return res.status(202).json({
        message: 'Image uploaded!',
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server error',
    });
  }
};
