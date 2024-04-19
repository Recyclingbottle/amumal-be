const express = require("express");
const postController = require("../controllers/postController");
const { authenticateToken } = require("../middleware/jwtMiddleware"); // JWT 인증 미들웨어 가져오기
const router = express.Router();

// 모든 게시글을 조회하는 라우트, JWT 인증 추가
router.get("/", authenticateToken, postController.listAllPosts);

// 특정 게시글의 상세 정보를 조회하는 라우트, JWT 인증 추가
router.get("/:postId", authenticateToken, postController.getPostDetails);

// 게시글 추가 라우트
router.post("/", authenticateToken, postController.createPost);

// 게시글 삭제 라우트
router.delete("/:postId", authenticateToken, postController.deletePost);

// 게시글 수정 라우트
router.patch("/:postId", authenticateToken, postController.editPost);

// 댓글 추가
router.post(
  "/:postId/comments",
  authenticateToken,
  postController.addCommentToPost
);
//댓글 목록 가져오기
router.get(
  "/:postId/comments",
  authenticateToken,
  postController.getPostComments
);

// 댓글 수정 라우트
router.patch(
  "/:postId/comments/:commentId",
  authenticateToken,
  postController.editComment
);

// 댓글 삭제 라우트
router.delete(
  "/:postId/comments/:commentId",
  authenticateToken,
  postController.deleteComment
);

module.exports = router;
