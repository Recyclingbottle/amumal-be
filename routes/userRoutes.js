const express = require("express");
const authController = require("../controllers/authController");
const { uploadImage, saveImage } = require("../controllers/uploadController");
const userController = require("../controllers/userController");

const router = express.Router();

// 로그인 처리를 위한 라우트
router.post("/login", authController.login);

// 회원가입 처리를 위한 라우트
router.post("/signup", authController.signup);

// 파일 업로드를 처리하는 라우트, 이미지 업로드 후 저장
router.post("/upload", uploadImage, saveImage);

// 이메일 중복 확인을 위한 라우트
router.get("/check-email", authController.checkEmailAvailability);

// 닉네임 중복 확인을 위한 라우트
router.get("/check-nickname", authController.checkNicknameAvailability);

// 사용자 정보 수정을 위한 라우트
router.patch("/:userId", userController.updateUser);

// 사용자 비밀번호 변경을 위한 라우트
router.patch("/:userId/password", userController.changeUserPassword);

// 사용자 계정 삭제를 위한 라우트
router.delete("/:userId", userController.deleteUser);

// 사용자 정보 조회 라우트
router.get("/:userId", userController.getUser);

// 로그인 상태 확인 라우트
router.get(
  "/auth/check",
  authController.authenticateToken,
  authController.checkLoginStatus
);
module.exports = router;
