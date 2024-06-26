const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer"); // 파일 업로드를 위한 Multer 라이브러리
require("dotenv").config(); // 환경변수 로드를 위해 dotenv 사용
const session = require("express-session");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes"); // 사용자 관련 라우트
const uploadRoutes = require("./routes/uploadRoutes"); // 파일 업로드 관련 라우트
const postRoutes = require("./routes/postRoutes"); // 게시글 라우트 불러오기
const app = express();

const pool = require("./db");
const corsOptions = {
  origin: "http://localhost:3000", // 클라이언트 URL을 명시적으로 지정
  credentials: true, // 쿠키와 세션을 허용하도록 설정
};
app.use(cors(corsOptions));
app.use(bodyParser.json()); // JSON 요청 본문 처리

// 세션 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS를 사용하는 경우 secure: true로 설정
  })
);

// 기본 경로
app.get("/", (req, res) => {
  res.send("아무 말 대잔치 API 서버");
});

// 사용자 관련 라우트 설정
app.use("/users", userRoutes);

// 파일 업로드 라우트 설정
app.use("/upload", uploadRoutes);

// 게시글 관련 라우트 설정
app.use("/posts", postRoutes);

// 정적 파일 경로 설정
app.use("/images", express.static("public/images"));

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer에서 발생한 오류 처리
    res.status(500).json({ message: err.message });
  } else if (err) {
    // 다른 모든 오류 처리
    res.status(500).json({ message: "An unknown error occurred" });
  } else {
    next(); // 다음 미들웨어로 이동
  }
});

const PORT = process.env.PORT || 3030; // 서버 포트 설정
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
