const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const userFilePath = path.join(__dirname, "..", "data", "user.json");
const saltRounds = 10;

// 사용자 데이터를 읽어오는 함수
exports.readUsers = () => {
  try {
    const usersData = fs.readFileSync(userFilePath, "utf-8");
    return JSON.parse(usersData);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return [];
  }
};

// 사용자 데이터를 쓰는 함수
exports.writeUsers = (users) => {
  try {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing JSON file:", error);
  }
};

/**
 * 사용자를 삭제하는 함수
 * @param {number} userId - 삭제할 사용자의 ID
 * @returns {boolean} 삭제 성공 여부
 */
exports.deleteUser = async (userId) => {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === parseInt(userId));

  if (index === -1) {
    console.error("User not found");
    return false; // 사용자를 찾지 못한 경우
  }

  // 사용자 삭제
  users.splice(index, 1);
  writeUsers(users); // 변경된 데이터를 파일에 저장
  return true; // 삭제 성공
};

/**
 * 사용자의 비밀번호를 변경하는 함수
 * @param {number} userId - 비밀번호를 변경할 사용자의 ID
 * @param {string} newPassword - 새로운 비밀번호
 * @returns {boolean|null} 성공적으로 변경되었으면 true, 사용자를 찾지 못하면 null
 */
exports.changePassword = async (userId, newPassword) => {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === parseInt(userId));

  if (index === -1) {
    console.error("User not found");
    return null; // 사용자를 찾지 못한 경우
  }

  // 새 비밀번호를 해시 처리
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  users[index].password = hashedPassword;

  writeUsers(users); // 변경된 사용자 데이터를 파일에 저장
  return true; // 비밀번호 변경 성공
};

/**
 * 사용자 정보를 업데이트하는 함수
 * @param {number} userId - 업데이트할 사용자의 ID
 * @param {Object} updateData - 업데이트할 정보가 담긴 객체 (닉네임, 프로필 이미지 등)
 * @returns {Object|null} 업데이트된 사용자 객체 또는 사용자를 찾지 못했을 때 null
 */
exports.updateUser = async (userId, updateData) => {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === parseInt(userId));

  if (index === -1) {
    console.error("User not found");
    return null;
  }

  // 사용자 정보 업데이트
  users[index] = { ...users[index], ...updateData };
  writeUsers(users); // 변경된 사용자 데이터를 파일에 저장
  return users[index];
};
/**
 * 사용자 데이터를 파일에서 동기적으로 읽어옵니다.
 * 파일 읽기에 실패할 경우 빈 배열을 반환합니다.
 * @returns {Array} 사용자 배열
 */
const readUsers = () => {
  try {
    const usersData = fs.readFileSync(userFilePath, "utf-8");
    return JSON.parse(usersData);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return [];
  }
};

/**
 * 사용자 데이터를 파일에 동기적으로 씁니다.
 * @param {Array} users 사용자 배열
 */
const writeUsers = (users) => {
  try {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing JSON file:", error);
  }
};

/**
 * 다음 사용자 ID를 생성합니다. 최대 ID에 1을 더한 값을 반환합니다.
 * @param {Array} users 사용자 배열
 * @returns {number} 새로운 사용자 ID
 */
const getNextUserId = (users) => {
  return users.length === 0 ? 1 : Math.max(...users.map((user) => user.id)) + 1;
};

/**
 * 새 사용자를 생성하고 JSON 파일에 저장합니다.
 * @param {Object} userData 사용자 데이터
 * @returns {Object} 새로 생성된 사용자 객체
 */
exports.createUser = async (userData) => {
  const users = readUsers();
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
  const userId = getNextUserId(users);
  const newUser = { id: userId, ...userData, password: hashedPassword };
  users.push(newUser);
  writeUsers(users);
  return newUser;
};

/**
 * 이메일을 통해 사용자를 찾습니다.
 * @param {string} email 사용자 이메일
 * @returns {Object|null} 사용자 객체 또는 null
 */
exports.findUserByEmail = (email) => {
  const users = readUsers();
  return users.find((user) => user.email === email);
};

/**
 * 주어진 이메일의 중복 여부를 확인합니다.
 * @param {string} email 확인할 이메일
 * @returns {boolean} 중복 여부
 */
exports.checkDuplicateEmail = (email) => {
  const users = readUsers();
  return users.some((user) => user.email === email);
};

/**
 * 주어진 닉네임의 중복 여부를 확인합니다.
 * @param {string} nickname 확인할 닉네임
 * @returns {boolean} 중복 여부
 */
exports.checkDuplicateNickname = (nickname) => {
  const users = readUsers();
  return users.some((user) => user.nickname === nickname);
};

/**
 * 이메일과 비밀번호를 검증하여 사용자를 인증합니다.
 * @param {string} email 사용자 이메일
 * @param {string} password 사용자 비밀번호
 * @returns {Object|null} 인증된 사용자 객체 또는 null
 */
exports.validateUser = async (email, password) => {
  const user = this.findUserByEmail(email);
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }
  return null;
};

// 특정 ID를 가진 사용자 정보를 조회
exports.findUserById = (userId) => {
  const users = readUsers();
  return users.find((user) => user.id === parseInt(userId));
};
