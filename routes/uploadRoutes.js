const express = require("express");
const { uploadImage, saveImage } = require("../controllers/uploadController");
const { authenticateSession } = require("../middleware/sessionMiddleware");
const router = express.Router();

router.post("/profile", uploadImage, saveImage);
router.post("/post", authenticateSession, uploadImage, saveImage);

module.exports = router;
