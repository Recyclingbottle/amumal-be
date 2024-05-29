const userModel = require("../models/userModel");
const { authenticateSession } = require("../middleware/sessionMiddleware"); // 세션 인증 미들웨어

//사용자 정보를 업데이트하는 함수
exports.updateUser = [
  authenticateSession, // 세션 인증
  async (req, res) => {
    const { userId } = req.params; // URL에서 userId 추출
    const { nickname, profile_image } = req.body; // 요청 본문에서 데이터 추출

    try {
      const updatedUser = await userModel.updateUser(userId, {
        nickname,
        profile_image,
      });
      if (updatedUser) {
        res
          .status(200)
          .json({ message: "User updated successfully", user: updatedUser });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  },
];

//사용자의 비밀번호를 변경하는 함수
exports.changeUserPassword = [
  authenticateSession, // 세션 인증
  async (req, res) => {
    const { userId } = req.params; // URL에서 userId 추출
    const { new_password } = req.body; // 요청 본문에서 데이터 추출

    try {
      const result = await userModel.changePassword(userId, new_password);
      if (result) {
        res.status(200).json({ message: "Password changed successfully" });
      } else {
        res.status(400).json({ message: "Invalid current password" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error changing password", error: error.message });
    }
  },
];

//사용자를 삭제하는 함수
exports.deleteUser = [
  authenticateSession, // 세션 인증
  async (req, res) => {
    const { userId } = req.params; // URL에서 userId 추출

    try {
      const result = await userModel.deleteUser(userId);
      if (result) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  },
];

//사용자 정보 조회
exports.getUser = [
  authenticateSession, // 세션 인증
  async (req, res) => {
    const { userId } = req.params; // URL에서 userId 추출
    try {
      const user = await userModel.findUserById(userId);
      if (user) {
        res.status(200).json({ message: "User found", user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving user", error: error.message });
    }
  },
];
