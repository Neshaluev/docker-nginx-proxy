const express = require("express");
const protect = require("../middleware/authMiddleware");

const postController = require("../controllers/postController");

const router = express.Router();

//localhost:3000/:id
router
  .route("/")
  .get(postController.getAllPosts)
  .post(protect, postController.createPost);

router
  .route("/:id")
  .get(postController.getOnePost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
