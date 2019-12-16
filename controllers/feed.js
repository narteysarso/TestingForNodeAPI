const {
  validationResult
} = require('express-validator/check');
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    title: "Some Post",
    content: "Some Post's content"
  });
};

exports.createPost = (req, res, next) => {
  const {
    title,
    content
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422) /**422 is validation failed HTTP status code */
      .json({
        message: "Validation failed ",
        errors
      })
  }
  res.status(201).json({
    message: "Post successfully created",
    post: {
      title,
      content
    }
  });
};