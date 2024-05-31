const express = require("express");
const router = express.Router();

const upload = require("../utils/multer");

// controllers and validations
const {
  getAllPosts,
  createPost,
  getPost,
  getPostsByUserId,
  searchPostsByKeyword,
  deletePost,
} = require("../controllers/postController");

const {
  postCreationValidation,
} = require("../utils/validations/postValidation");

// create a post 
router.post("/", upload.single("image"), postCreationValidation, createPost);


// get all posts
router.get("/", getAllPosts);

// get user posts
router.get('/posts/user', getPostsByUserId);

// get a post by post id
router.get("/:id", getPost);

// post search
router.get("/search", searchPostsByKeyword);

// delete a post
router.delete("/:id", deletePost);

module.exports = router;
