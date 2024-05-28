const joi = require('joi');
const errorFunction = require('../utils/joiErrors.utils');

const signupUserValidator = joi.object({
  firstName: joi.string().alphanum().min(3).max(25)
    .trim(true)
    .required(),
  lastName: joi.string().alphanum().min(3).max(25)
    .trim(true)
    .required(),
  username: joi.string().alphanum().min(3).max(25)
    .trim(true)
    .required(),
  email: joi.string().email().trim(true).required(),
  phone: joi
    .string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
  password: joi.string().min(8).trim(true).required(),
  role: joi
    .string()
    .valid('super-admin', 'sub-admin', 'user')
    .required(),
});

const signUpUserValidation = async (req, res, next) => {
  const payload = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: req.body.role,
  };

  const { error } = signupUserValidator.validate(payload);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, `Error in User Data : ${error.message}`),
    );
  }
  return next();
};

const loginUserValidator = joi.object({
  username: joi.string().alphanum().min(3).max(25)
    .trim(true)
    .required(),
  password: joi.string().min(8).trim(true).required()
    .required(),
});

const loginUserValidation = async (req, res, next) => {
  const payload = {
    username: req.body.username,
    password: req.body.password,
  };

  const { error } = loginUserValidator.validate(payload);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, `Error in User Data : ${error.message}`),
    );
  }
  return next();
};

const updateUserValidator = joi.object({
  firstName: joi.string().alphanum().min(3).max(25)
    .trim(true)
    .required(),
  lastName: joi.string().alphanum().min(3).max(25)
    .trim(true)
    .required(),
  username: joi.string().alphanum().min(3).max(25)
    .trim(true)
    .required(),
  email: joi.string().email().trim(true).required(),
  phone: joi
    .string()
    .length(10)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
  role: joi
    .string()
    .valid('super-admin', 'sub-admin', 'user')
    .required(),
});

const updateUserValidation = async (req, res, next) => {
  const payload = {
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: req.body.role,
  };

  const { error } = updateUserValidator.validate(payload);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, `Error in User Data : ${error.message}`),
    );
  }
  return next();
};

module.exports = {
  signUpUserValidation,
  loginUserValidation,
  updateUserValidation,
};
