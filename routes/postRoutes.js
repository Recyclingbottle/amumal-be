const express = require("express");
const postController = require("../controllers/postController");
const { authenticateSession } = require("../middleware/sessionMiddleware");
const router = express.Router();

router.get("/", authenticateSession, postController.listAllPosts);
router.get("/:postId", authenticateSession, postController.getPostDetails);
router.post("/", authenticateSession, postController.createPost);
router.delete("/:postId", authenticateSession, postController.deletePost);
router.patch("/:postId", authenticateSession, postController.editPost);
router.post(
  "/:postId/comments",
  authenticateSession,
  postController.addCommentToPost
);
router.get(
  "/:postId/comments",
  authenticateSession,
  postController.getPostComments
);
router.patch(
  "/:postId/comments/:commentId",
  authenticateSession,
  postController.editComment
);
router.delete(
  "/:postId/comments/:commentId",
  authenticateSession,
  postController.deleteComment
);

module.exports = router;
