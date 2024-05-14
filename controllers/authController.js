require("dotenv").config();
const userModel = require("../models/userModel");

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
};

const ERROR_MESSAGES = {
  LOGIN_FAILED: "로그인 실패",
  EMAIL_EXISTS: "이미 사용 중인 이메일입니다.",
  NICKNAME_EXISTS: "이미 사용 중인 닉네임입니다.",
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.validateUser(email, password);

  if (user) {
    req.session.user = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profile_image,
    };

    res.status(HTTP_STATUS.OK).json({ message: "로그인 성공" });
  } else {
    res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: ERROR_MESSAGES.LOGIN_FAILED });
  }
};

exports.signup = async (req, res) => {
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
  await userModel.createUser(newUser);
  res
    .status(HTTP_STATUS.CREATED)
    .json({ message: "회원가입이 완료되었습니다.", user: newUser });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "로그아웃 실패" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "로그아웃 성공" });
  });
};

exports.checkLoginStatus = (req, res) => {
  if (req.session.user) {
    res
      .status(200)
      .json({ message: "You are logged in.", user: req.session.user });
  } else {
    res.status(401).json({ message: "You are not logged in." });
  }
};
