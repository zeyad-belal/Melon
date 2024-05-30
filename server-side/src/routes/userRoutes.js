const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  signUp,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  login,
} = require("../controllers/userController");

const {
  loginValidation,
  signupValidation
} = require("../utils/validations/authenticationSchema");
const verfiyUserToken = require("../middlewares/verfiyUserToken"); 



// registration create new user
router.post("/signup", signupValidation, signUp);

//login
router.post("/login", loginValidation, login);

//get all users
router.get("/", verfiyUserToken, getAllUsers);

//get user by id
router.get("/:id", verfiyUserToken, getUserById);


// update user
router.put("/:id", verfiyUserToken,upload.single("avatar"), updateUser);
router.patch("/:id", verfiyUserToken,upload.single("avatar"), updateUser);


module.exports = router;
