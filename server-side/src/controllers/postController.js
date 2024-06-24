const { Types } = require("mongoose");

const Post = require("../models/Post");

const AppError = require("../utils/AppError");
const imageKit = require("../utils/imageKit");
const User = require("../models/User");

const createPost = async (req, res, next) => {
  console.log('req recieved')
  if (!req.file) {
    return next(new AppError("Upload at least one image of the Post", 404));
  }

  // find if user sent exists
  const user = await User.findOne({
    _id: req.body.user_id,
  });
  if (!user) return next(new AppError("User does not exist.", 404));

  // handle image upload
  const image = req.file;
  const imageInfo = await imageKit.upload({
    file: image.buffer.toString("base64"),
    fileName: image.originalname,
    folder: "Melon-posts",
  });

  const createdPost = await Post.create({
    name: req.body.name,
    description: req.body.description,
    keywords: req.body.keywords.split(","),
    image: imageInfo,
    user_id: user._id
  });

  const toBeSentDocument = await Post.findById(createdPost._id).populate("user_id");

  res.send({ message: "Post was created successfully!", toBeSentDocument });
};

const getAllPosts = async (req, res, next) => {
  const Posts = await Post.find().populate("user_id");
  if (!Posts) return next(new AppError("No Posts found.", 404));
  res.send(Posts);
};

const getPost = async (req, res, next) => {
  // check if id is a valid objectId
  if (!Types.ObjectId.isValid(req.params.id))
    return next(new AppError("Invalid ObjectId.", 401));

  const post = await Post.findById(req.params.id)

  if (!post) return next(new AppError("Post was not found.", 404));

  res.send(post);
};

const getPostsByUserId = async (req, res, next) => {
  try {
    // check if user_id is provided
    if (!req.params.user_id) {
      return next(new AppError("User ID is required.", 400));
    }

    // check if user_id is a valid objectId
    if (!Types.ObjectId.isValid(req.params.user_id)) {
      return next(new AppError("Invalid User ID.", 400));
    }

    // find posts by user_id
    const posts = await Post.find({ user_id: req.params.user_id }).populate("user_id");

    if (!posts || posts.length === 0) {
      return next(new AppError("No posts found for the given user ID.", 404));
    }

    res.send(posts);
  } catch (error) {
    return next(new AppError("Something went wrong while fetching posts by user ID.", 500));
  }
};

const searchPostsByKeyword = async (req, res, next) => {
  try {
    // Check if search string is provided
    const searchString = req.keyword;
    if (!searchString) {
      return next(new AppError("Keyword is required.", 400));
    }

    // Create a regex pattern for case-insensitive search
    const regex = new RegExp(searchString, 'i');

    // Find posts that have at least one keyword matching the search string
    const posts = await Post.find({ keywords: regex }).populate("user_id");

    if (!posts || posts.length === 0) {
      return next(new AppError("No posts found for the given keyword.", 404));
    }

    res.send(posts);
  } catch (error) {
    return next(new AppError("Something went wrong while searching for posts.", 500));
  }
};

const deletePost = async (req, res, next) => {
  // Check if id is a valid objectId
  if (!Types.ObjectId.isValid(req.params.id))
    return next(new AppError("Invalid ObjectId.", 401));

  try {
    // Find the post by id
    const post = await Post.findById(req.params.id);
    if (!post) return next(new AppError("Post was not found.", 404));

    // Get the image ID to be deleted
    const imageID = post.image.fileId;

    // Delete the post
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return next(new AppError("Post was not found.", 404));

    // Delete the image from ImageKit
    const deletionResult = await imageKit.deleteFile(imageID);
    if (!deletionResult)
      return next(
        new AppError("Error occurred while deleting post image from ImageKit.", 500)
      );

    res.send({ message: "Post was deleted successfully!", post: deletedPost });
  } catch (error) {
    return next(new AppError("Error occurred while deleting the post.", 500));
  }
};


module.exports = {
  getAllPosts,
  createPost,
  getPost,
  getPostsByUserId,
  searchPostsByKeyword,
  deletePost,
};
