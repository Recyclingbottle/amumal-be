const jwt = require("jsonwebtoken");
require("dotenv").config(); // 환경 변수 로드

// 환경 변수에서 JWT 비밀 키를 가져옵니다.
const secretKey = process.env.JWT_SECRET;

/**
 * JWT를 검증하는 미들웨어 함수입니다.
 * 요청 헤더에서 토큰을 추출하고, 유효한 토큰인지 확인합니다.
 * 유효한 토큰일 경우, 요청 객체에 사용자 정보를 추가하고 다음 미들웨어로 넘깁니다.
 * 유효하지 않은 토큰일 경우, 적절한 HTTP 상태 코드로 응답합니다.
 *
 * @param {Object} req - HTTP 요청 객체
 * @param {Object} res - HTTP 응답 객체
 * @param {Function} next - 다음 미들웨어 호출 함수
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // 요청 헤더에서 'authorization' 값을 가져옵니다.
  const token = authHeader && authHeader.split(" ")[1]; // 'Bearer token' 형태의 헤더에서 토큰 부분만 추출합니다.

  if (token == null) {
    // 토큰이 제공되지 않은 경우
    return res.sendStatus(401); // 401 Unauthorized 상태 코드로 응답
  }

  // 토큰 검증
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      // 토큰이 유효하지 않은 경우
      return res.sendStatus(403); // 403 Forbidden 상태 코드로 응답
    }

    req.user = user; // 검증된 토큰에서 추출한 사용자 정보를 요청 객체에 추가
    next(); // 다음 미들웨어로 처리를 넘깁니다.
  });
};

exports.authenticateToken = authenticateToken; // 이 미들웨어 함수를 내보냅니다.
