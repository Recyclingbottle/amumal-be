/**
 * 세션을 검증하는 미들웨어 함수입니다.
 * 세션이 유효하면 요청 객체에 사용자 정보를 추가하고 다음 미들웨어로 넘깁니다.
 * 세션이 유효하지 않을 경우, 적절한 HTTP 상태 코드로 응답합니다.
 *
 * @param {Object} req - HTTP 요청 객체
 * @param {Object} res - HTTP 응답 객체
 * @param {Function} next - 다음 미들웨어 호출 함수
 */
const authenticateSession = (req, res, next) => {
  if (req.session && req.session.user) {
    // 세션에 사용자 정보가 있으면 요청 객체에 사용자 정보를 추가
    req.user = req.session.user;
    next(); // 다음 미들웨어로 처리를 넘깁니다.
  } else {
    // 세션에 사용자 정보가 없을 경우
    res.sendStatus(401); // 401 Unauthorized 상태 코드로 응답
  }
};

module.exports = {
  authenticateSession,
};
