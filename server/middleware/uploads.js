const multer = require('multer');
const path = require('path');

// กำหนด storage สำหรับการอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // บันทึกไฟล์ในโฟลเดอร์ uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // ตั้งชื่อไฟล์ใหม่
  },
});

// ตรวจสอบประเภทไฟล์ (Optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // ยอมรับไฟล์
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false); // ปฏิเสธไฟล์
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาดไฟล์ 5MB
  fileFilter: fileFilter,
});

module.exports = upload;
