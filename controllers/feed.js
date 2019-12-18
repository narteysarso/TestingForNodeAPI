const {
  validationResult
} = require("express-validator");
const checkError = require("../utils/checkErrors");

const Post = require("../models/post");
const User = require("../models/user");


//Gets all posts with pagination support
exports.getPosts = (req, res, next) => {
  const {
    currentPage
  } = req.query;
  const perPage = 2;
  let totalItems;

  Post.find().countDocuments().then(
    count => {
      totalItems = count;
      return Post.find().skip((currentPage - 1) * perPage).limit(perPage);
    }
  ).then(posts => {
    res.status(200).json({
      message: "Fetched post successfully",
      posts,
      totalItems
    });
  }).catch(err => {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  })

};

exports.getPost = (req, res, next) => {
  const {
    postId
  } = req.params;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Post found",
        post
      });
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const {
    postId
  } = req.params;
  checkError(req);
  const {
    title,
    content,
    imageUrl
  } = req.body;
  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("Action disallowed");
        error.statusCode = 401;
        throw error;
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    }).then(post => {
      res.status(200).json({
        message: "Post successfully updated",
        post
      });
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const {
    title,
    content
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }

  const post = new Post({
    title,
    content,
    imageUrl: "images/img.jpg",
    creator: req.userId
  });

  post
    .save()
    .then((post) => {
      return User.findById(req.userId);
    }).then(user => {
      user.posts.push(post);
      return user.save();
    }).then(user => {
      res.status(201).json({
        message: "Post successfully created",
        post,
        creator: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      })
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500;

      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const {
    postId
  } = req.params;

  Post.findById(postId).then(post => {
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Action disallowed");
      error.statusCode = 401;
      throw error;
    }
    return Post.findByIdAndRemove(postId)
  }).then(() => {
    return User.findById(req.userId);
  }).then(user => {
    user.posts.pull(postId);
    return user.save();
  }).then(result => {
    res.status(200).json({
      message: "Post deleted"
    })
  }).catch(err => {
    if (!err.statusCode) err.statusCode = 500;

    next(err);
  })
}