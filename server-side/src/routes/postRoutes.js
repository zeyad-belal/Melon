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
router.post("/create", upload.single("image"), postCreationValidation, createPost);

// post search
router.get("/search/:keyword", searchPostsByKeyword);


// get user posts
router.get('/user/:user_id', getPostsByUserId);

// get a post by post id
router.get("/:id", getPost);


// delete a post
router.delete("/:id", deletePost);

// get all posts
router.get("/", getAllPosts);

module.exports = router;
