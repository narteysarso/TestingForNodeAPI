const router = require("express").Router();
const {
  body
} = require("express-validator");
const feedController = require("../controllers/feed");

//GET /feed/posts
router.get("/posts", feedController.getPosts);

//GET /feed/post/:postId
router.get("/post/:postId", feedController.getPost);

//PUT /feed/post/:postId
router.put("/post/:postId", feedController.updatePost);

//DELETE /feed/post/:postId
router.delete("/post/:postId", feedController.deletePost);

//POST /feed/post
router.post(
  "/post",
  [
    body("title")
    .trim()
    .isLength({
      min: 5
    }),
    body("content")
    .trim()
    .isLength({
      min: 5
    })
  ],
  feedController.createPost
);

module.exports = router;