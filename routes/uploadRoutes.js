const express = require("express");
const router = express.Router();
const { uploadImage, saveImage } = require("../controllers/uploadController");
const { authenticateToken } = require("../middleware/jwtMiddleware");

// 프로필 이미지 업로드
router.post("/profile", uploadImage, saveImage);

// 게시글 이미지 업로드
router.post("/post", authenticateToken, uploadImage, saveImage);

module.exports = router;
