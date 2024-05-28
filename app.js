const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const postRoutes = require("./routes/postRoutes");
const cors = require("cors");
const session = require("express-session");
const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // 클라이언트 URL을 명시적으로 지정
  credentials: true, // 쿠키와 세션을 허용하도록 설정
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS 환경에서만 true로 설정
  })
);

app.get("/", (req, res) => {
  res.send("아무 말 대잔치 API 서버");
});

app.use("/users", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/posts", postRoutes);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(500).json({ message: err.message });
  } else if (err) {
    res.status(500).json({ message: "An unknown error occurred" });
  } else {
    next();
  }
});

app.use("/images", express.static("public/images"));
