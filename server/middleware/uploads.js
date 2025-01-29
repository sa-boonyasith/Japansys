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

// ตรวจสอบประเภทไฟล์ (รองรับทั้งรูปภาพและเอกสาร PDF)
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    photo: ['image/jpeg', 'image/png', 'image/gif'],  // รูปภาพ
    documents: ['application/pdf'], // เอกสาร PDF เท่านั้น
  };

  if (file.fieldname === "photo" && allowedTypes.photo.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === "documents" && allowedTypes.documents.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF (photo) | PDF (documents)'), false);
  }
};

// กำหนดการอัปโหลดให้รองรับหลายไฟล์
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาดไฟล์ 5MB
  fileFilter: fileFilter,
});

module.exports = upload;
