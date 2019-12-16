exports.getPosts = (req, res, next) => {
  res.status(200).json({
    title: "Some Post",
    content: "Some Post's content"
  });
};

exports.createPost = (req, res, next) => {
  const { title, content } = req.body;
  res.status(201).json({
    message: "Post successfully created",
    post: {
      title,
      content
    }
  });
};
