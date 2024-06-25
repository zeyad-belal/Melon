const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const imageKit = require("../utils/imageKit");

// registration
const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!email || !password)
    return next(new AppError("email and password required", 401));
  
  try {
    const newUser = await User.create({
      name,
      email,
      password
    });
    newUser.password = undefined;
    const user = await User.findOne({ email });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.send({ message: "user created successfully", newUser, token });
  } catch (error) {
    // Check for duplicate email error
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.email === 1
    ) {
      return next(new AppError("Email is already registered", 400));
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("email and password are required", 401));

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new AppError("user not found", 404));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError("invalid credentials", 401));

  let token;

  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  user.password = undefined;

  res.send({ user, token });
};

//get all users
const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.send(users);
};

//get user by id
const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("saved_items.post");

  if (!user) return next(new AppError("user not found", 404));
  res.send({ user });
};

// update user info
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  let { saved_items } = req.body;



  const user = await User.findByIdAndUpdate(
    id,
    { saved_items },
    { new: true }
  );

  res.send({ user });
};

module.exports = {
  signUp,
  getUserById,
  getAllUsers,
  updateUser,
  login,
};
