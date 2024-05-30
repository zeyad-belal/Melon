const fs = require("fs");
const { Types } = require("mongoose");

const Post = require("../models/Post");

const AppError = require("../utils/AppError");
const imageKit = require("../utils/imageKit");
const User = require("../models/User");

const createPost = async (req, res, next) => {
  if (!req.files) {
    return next(new AppError("Upload at least one image of the Post", 404));
  }

  // find if user sent exists
  const user = await User.findOne({
    _id: req.body.user_id,
  });
  if (!user) return next(new AppError("User does not exist.", 404));

  // handle images upload
  let imagesInfo = [];
  for (let i = 0; i < req.files.length; i++) {
    const image = req.files[i];
    const res = await imageKit.upload({
      file: image.buffer.toString("base64"),
      fileName: image.originalname,
      folder: "Melon-posts",
    });
    imagesInfo.push(res);
  }

  const createdPost = await Post.create({
    name: req.body.name,
    description: req.body.description,
    keywords: req.body.keywords.split(","),
    images: imagesInfo,
    user_id: user._id
  });

  const toBeSentDocument = await Post.findById(createdPost._id).populate("user_id")

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


const deletePost = async (req, res, next) => {
  // check if id is a valid objectId
  if (!Types.ObjectId.isValid(req.params.id))
    return next(new AppError("Invalid ObjectId.", 401));

  const post = await Post.findByIdAndDelete(req.params.id);
  console.log(post)
  if (!post) return next(new AppError("post was not found.", 404));

  const imagesID = post.images.map((image) => image.fileId);

  // delete post's images from imageKit
  if (post.images.length) {
    const res = await imageKit.bulkDeleteFiles(imagesID);

    if (!res)
      return next(
        new AppError(
          "There was an error in deleting post images from ImageKit.",
          401
        )
      );
  }

  res.send({ message: "post was deleted successfully!", post });
};

module.exports = {
  getAllPosts,
  createPost,
  getPost,
  deletePost,
};
