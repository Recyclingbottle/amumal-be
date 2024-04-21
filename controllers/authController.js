// 환경 설정 로드
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// 환경 변수에서 비밀 키 가져오기
const secretKey = process.env.JWT_SECRET;

// HTTP 상태 코드 상수 정의
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
};

// 에러 메시지 상수 정의
const ERROR_MESSAGES = {
  LOGIN_FAILED: "로그인 실패",
  EMAIL_EXISTS: "이미 사용 중인 이메일입니다.",
  NICKNAME_EXISTS: "이미 사용 중인 닉네임입니다.",
};

/**
 * 사용자 로그인 처리
 * @param {Request} req - HTTP 요청
 * @param {Response} res - HTTP 응답
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.validateUser(email, password);

  if (user) {
    // 사용자가 검증되면, 사용자 정보를 바탕으로 JWT 토큰 생성
    const tokenData = {
      userId: user.id, // 사용자 ID 인데 제거해야하나 다른데서 불러왔을 수도 있으니 삭제하지 않음 //아 근데 다른데서 써야함 어딘지 기억안나니 일단 이렇게 씀
      email: user.email, // 사용자 이메일
      nickname: user.nickname, // 사용자 닉네임
      profileImage: user.profile_image, // 사용자 프로필 이미지 경로
    };
    const token = jwt.sign(tokenData, secretKey, { expiresIn: "1h" });

    res.status(HTTP_STATUS.OK).json({ message: "로그인 성공", token });
  } else {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.LOGIN_FAILED });
  }
};

/**
 * 사용자 회원가입 처리
 * @param {Request} req - HTTP 요청
 * @param {Response} res - HTTP 응답
 */
exports.signup = (req, res) => {
  console.log(req.body);
  const { email, password, nickname, profile_image } = req.body;

  if (userModel.checkDuplicateEmail(email)) {
    return res
      .status(HTTP_STATUS.CONFLICT)
      .json({ message: ERROR_MESSAGES.EMAIL_EXISTS });
  }

  if (userModel.checkDuplicateNickname(nickname)) {
    return res
      .status(HTTP_STATUS.CONFLICT)
      .json({ message: ERROR_MESSAGES.NICKNAME_EXISTS });
  }

  const newUser = { email, password, nickname, profile_image };
  userModel.createUser(newUser);
  res
    .status(HTTP_STATUS.CREATED)
    .json({ message: "회원가입이 완료되었습니다.", user: newUser });
};

/**
 * 이메일 중복 검사
 * @param {Request} req - HTTP 요청
 * @param {Response} res - HTTP 응답
 */
exports.checkEmailAvailability = (req, res) => {
  const available = !userModel.checkDuplicateEmail(req.query.email);
  res.status(200).json({
    message: available
      ? "사용 가능한 이메일입니다."
      : "이미 사용 중인 이메일입니다.",
  });
};

/**
 * 닉네임 중복 검사
 * @param {Request} req - HTTP 요청
 * @param {Response} res - HTTP 응답
 */
exports.checkNicknameAvailability = (req, res) => {
  const available = !userModel.checkDuplicateNickname(req.query.nickname);
  res.status(200).json({
    message: available
      ? "사용 가능한 닉네임입니다."
      : "이미 사용 중인 닉네임입니다.",
  });
};

// JWT 토큰 검증 미들웨어
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// 로그인 상태 확인
exports.checkLoginStatus = (req, res) => {
  res.status(200).json({
    message: "You are logged in.",
    user: req.user,
  });
};
