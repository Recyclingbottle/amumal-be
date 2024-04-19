const userModel = require("../models/userModel");
const { authenticateToken } = require("../middleware/jwtMiddleware"); // JWT 인증 미들웨어

/**
 * 사용자 정보를 업데이트하는 함수
 */
exports.updateUser = [
  authenticateToken, // JWT 인증
  async (req, res) => {
    const { userId } = req.params; // URL에서 userId 추출
    const { nickname, profile_image } = req.body; // 요청 본문에서 데이터 추출

    try {
      const updatedUser = await userModel.updateUser(userId, {
        nickname,
        profile_image,
      });
      res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  },
];

/**
 * 사용자의 비밀번호를 변경하는 함수
 */
exports.changeUserPassword = [
  authenticateToken, // JWT 인증
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

/**
 * 사용자를 삭제하는 함수
 */
exports.deleteUser = [
  authenticateToken, // JWT 인증
  async (req, res) => {
    const { userId } = req.params; // URL에서 userId 추출

    try {
      await userModel.deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  },
];

// 사용자 정보를 업데이트하는 함수
exports.updateUser = [
  authenticateToken,
  async (req, res) => {
    const { userId } = req.params;
    const { nickname, profile_image } = req.body;

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

// 사용자 비밀번호를 변경하는 함수
exports.changePassword = async (userId, newPassword) => {
  const users = userModel.readUsers();
  const index = users.findIndex((user) => user.id === parseInt(userId));

  if (index === -1) {
    return null; // 사용자를 찾지 못한 경우
  }

  // 새 비밀번호를 해시 처리
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  users[index].password = hashedPassword;

  userModel.writeUsers(users); // 변경된 데이터를 파일에 저장
  return true; // 비밀번호 변경 성공
};

// 사용자 정보 조회
exports.getUser = [
  authenticateToken, // JWT 인증
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
