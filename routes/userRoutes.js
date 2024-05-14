const express = require("express");
const authController = require("../controllers/authController");
const { uploadImage, saveImage } = require("../controllers/uploadController");
const userController = require("../controllers/userController");
const { authenticateSession } = require("../middleware/sessionMiddleware");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/upload", uploadImage, saveImage);
router.get("/check-email", authController.checkEmailAvailability);
router.get("/check-nickname", authController.checkNicknameAvailability);
router.patch("/:userId", authenticateSession, userController.updateUser);
router.patch(
  "/:userId/password",
  authenticateSession,
  userController.changeUserPassword
);
router.delete("/:userId", authenticateSession, userController.deleteUser);
router.get("/:userId", authenticateSession, userController.getUser);
router.get("/auth/check", authController.checkLoginStatus);
router.post("/logout", authController.logout);

module.exports = router;
