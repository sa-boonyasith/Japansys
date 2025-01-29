const multer = require("multer");

// ตั้งค่าการเก็บไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // โฟลเดอร์ที่เก็บไฟล์
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // ตั้งชื่อไฟล์
  },
});

// ตั้งค่าการกรองประเภทไฟล์
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("ประเภทไฟล์ไม่ถูกต้อง"), false);
  }
};

// ตั้งค่าขนาดไฟล์สูงสุด
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
};

// สร้าง middleware สำหรับอัปโหลด
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

module.exports = upload;