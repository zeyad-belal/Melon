const express = require("express");
const router = express.Router();

const upload = require("../utils/multer");

// controllers and validations
const {
  getAllPosts,
  getPostbyCategoryId,
  createPost,
  getPost,
  deletePost,
} = require("../controllers/postController");

const {
  postCreationValidation,
} = require("../utils/validations/postValidation");

// create a post
router.post("/", upload.array("images"), postCreationValidation, createPost);

// get all posts
router.get("/", getAllPosts);

// get  posts by gategory id
router.get("/filtered/:id", getPostbyCategoryId);

// get a post by post id
router.get("/:id", getPost);

// delete a post
router.delete("/:id", deletePost);

module.exports = router;
