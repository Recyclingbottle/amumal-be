const pool = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// 사용자 생성
exports.createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
  const [result] = await pool.query(
    "INSERT INTO Users (email, password, nickname, profile_picture) VALUES (?, ?, ?, ?)",
    [userData.email, hashedPassword, userData.nickname, userData.profile_image]
  );
  return result.insertId;
};

// 이메일로 사용자 찾기
exports.findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

// 사용자 ID로 사용자 찾기
exports.findUserById = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM Users WHERE id = ?", [userId]);
  return rows[0];
};

// 이메일 중복 확인
exports.checkDuplicateEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [
    email,
  ]);
  return rows.length > 0;
};

// 닉네임 중복 확인
exports.checkDuplicateNickname = async (nickname) => {
  const [rows] = await pool.query("SELECT * FROM Users WHERE nickname = ?", [
    nickname,
  ]);
  return rows.length > 0;
};

// 사용자 검증
exports.validateUser = async (email, password) => {
  const user = await this.findUserByEmail(email);
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }
  return null;
};

// 사용자 정보 업데이트
exports.updateUser = async (userId, updateData) => {
  const fields = [];
  const values = [];

  if (updateData.nickname) {
    fields.push("nickname = ?");
    values.push(updateData.nickname);
  }

  if (updateData.profile_image) {
    fields.push("profile_picture = ?");
    values.push(updateData.profile_image);
  }

  values.push(userId);

  const query = `UPDATE Users SET ${fields.join(", ")} WHERE id = ?`;
  const [result] = await pool.query(query, values);

  return result.affectedRows > 0;
};

// 비밀번호 변경
exports.changePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  const [result] = await pool.query(
    "UPDATE Users SET password = ? WHERE id = ?",
    [hashedPassword, userId]
  );
  return result.affectedRows > 0;
};

// 사용자 삭제
exports.deleteUser = async (userId) => {
  const [result] = await pool.query("DELETE FROM Users WHERE id = ?", [userId]);
  return result.affectedRows > 0;
};
