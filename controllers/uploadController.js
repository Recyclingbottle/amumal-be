const multer = require("multer");
const path = require("path");

// 요청에 따라 파일 저장 위치를 결정하는 함수 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // // 요청의 baseUrl 출력
    // console.log("Request baseUrl:", req.baseUrl);
    // console.log("Original URL:", req.originalUrl); // 전체 요청 URL 확인을 위한 로그 추가

    let uploadPath;
    if (req.originalUrl.includes("/profile")) {
      uploadPath = "public/images/profile/";
    } else if (req.originalUrl.includes("/post")) {
      uploadPath = "public/images/posts/";
    } else {
      uploadPath = "public/images/";
    }

    console.log("Resolved Upload Path:", uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 단일 이미지 업로드를 처리하는 미들웨어
exports.uploadImage = upload.single("image");

exports.saveImage = (req, res) => {
  if (req.file) {
    // 호스트 주소와 파일 경로를 결합하여 외부에서 접근 가능한 URL 생성
    const fileUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.path.split("public/images/")[1]
    }`;
    res.json({
      message: "File uploaded successfully",
      url: fileUrl, // 클라이언트에게 파일 URL 반환
    });
  } else {
    res.status(400).json({ message: "No file uploaded" });
  }
};
