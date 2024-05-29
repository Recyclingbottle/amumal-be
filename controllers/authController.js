const userModel = require("../models/userModel");

// 로그인 처리
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.validateUser(email, password);

  if (user) {
    req.session.user = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profile_image: user.profile_picture,
    };

    res.status(200).json({
      message: "로그인 성공",
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        profile_image: user.profile_picture,
      },
    });
  } else {
    res.status(401).json({ message: "로그인 실패" });
  }
};

// 회원가입 처리
exports.signup = async (req, res) => {
  try {
    const { email, password, nickname, profile_image } = req.body;

    if (await userModel.checkDuplicateEmail(email)) {
      return res.status(409).json({ message: "이미 사용 중인 이메일입니다." });
    }

    if (await userModel.checkDuplicateNickname(nickname)) {
      return res.status(409).json({ message: "이미 사용 중인 닉네임입니다." });
    }

    const newUser = await userModel.createUser({
      email,
      password,
      nickname,
      profile_image,
    });
    res
      .status(201)
      .json({ message: "회원가입이 완료되었습니다.", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "회원가입 중 오류가 발생했습니다.",
        error: error.message,
      });
  }
};

// 이메일 중복 확인
exports.checkEmailAvailability = async (req, res) => {
  const available = !(await userModel.checkDuplicateEmail(req.query.email));
  res.status(200).json({
    message: available
      ? "사용 가능한 이메일입니다."
      : "이미 사용 중인 이메일입니다.",
  });
};

// 닉네임 중복 확인
exports.checkNicknameAvailability = async (req, res) => {
  const available = !(await userModel.checkDuplicateNickname(
    req.query.nickname
  ));
  res.status(200).json({
    message: available
      ? "사용 가능한 닉네임입니다."
      : "이미 사용 중인 닉네임입니다.",
  });
};

// 로그인 상태 확인
exports.checkLoginStatus = (req, res) => {
  if (req.session.user) {
    res.status(200).json({
      message: "You are logged in.",
      user: req.session.user,
    });
  } else {
    res.status(401).json({ message: "You are not logged in." });
  }
};

// 로그아웃 처리
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "로그아웃 중 오류가 발생했습니다." });
    }
    res.status(200).json({ message: "로그아웃 성공" });
  });
};
