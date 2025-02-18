const express = require("express");
const router = express.Router();
const multer = require("multer");
const { create, list, update, remove, uploadPhoto } = require("../controller/employee");

// ตั้งค่าการอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // กำหนดโฟลเดอร์ที่ใช้เก็บไฟล์
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes หลักของ employee
router.get("/employee", list);
router.post("/employee", create);
router.put("/employee/:id", update);
router.delete("/employee/:id", remove);

// Route สำหรับอัปโหลดรูปพนักงาน
router.post("/employee/:id/photo", upload.single("photo"), uploadPhoto);

module.exports = router;
