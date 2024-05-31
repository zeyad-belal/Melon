const joi = require("joi");
const AppError = require("../AppError");

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).max(20).required(),
});

const signupSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).max(20).required(),
  name: joi.string().min(3).max(20).required(),
});

const loginValidation = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return next(new AppError(error, 401));
  next();
};

const signupValidation = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) return next(new AppError(error, 401));
  next();
};

module.exports = { loginValidation, signupValidation };
