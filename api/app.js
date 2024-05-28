const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();
const userRoutes = require("../routes/userRoutes");
const uploadRoutes = require("../routes/uploadRoutes");
const postRoutes = require("../routes/postRoutes");
const cors = require("cors");
const session = require("express-session");
const app = express();

app.use(cors());
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

module.exports = app;
