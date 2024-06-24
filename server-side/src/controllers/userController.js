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
  const user = await User.findById(id).populate({
    path: "saved_items.post",
    populate: {
      path: "user_id",
      model: "User",
    },
  });

  if (!user) return next(new AppError("user not found", 404));
  res.send({ user });
};

// update user info
const updateUser = async (req, res, next) => {
  const { id } = req.params.id;
  const { name, email } = req.body;
  let { avatar, avatarID,saved_items } = req.body;
console.log('saved_items',saved_items)
  // handle new image uploud
  if (req.file) {
    if (avatarID) {
      try {
        await imageKit.bulkDeleteFiles([avatarID]);
      } catch (error) {
        return next(
          new AppError(
            "There was an error in deleting user image from ImageKit.",
            404
          )
        );
      }
    }
    const image = req.file;
    const res = await imageKit.upload({
      file: image.buffer.toString("base64"),
      fileName: image.originalname,
      folder: "connect-users",
    });
    avatarID = res.fileId;
    avatar = res.url;
  }

  // handle deleltion of avatar
  if (!avatar && !req.file && avatarID) {
    avatar =
      "https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg?size=626&ext=jpg&ga=GA1.1.1326869177.1680443547&semt=sph";
    try {
      await imageKit.bulkDeleteFiles([avatarID]);
    } catch (error) {
      return next(
        new AppError(
          "There was an error in deleting user image from ImageKit.",
          404
        )
      );
    }
  }

  const user = await User.findByIdAndUpdate(
    id,
    { name, email, avatar, avatarID, saved_items },
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
