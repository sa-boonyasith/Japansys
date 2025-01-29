const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads"); // เรียกใช้ upload middleware
const { create, list, update, remove, listspecific } = require("../controller/jobaplication");

// อัปโหลดหลายไฟล์พร้อมกัน (photo 1 รูป, documents ได้สูงสุด 5 ไฟล์)
router.post(
  "/jobaplication",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  (err, req, res, next) => {
    // จัดการข้อผิดพลาดที่เกิดขึ้นระหว่างอัปโหลด
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  },
  create
);

// Routes อื่นๆ
router.get("/jobaplication", list); // ดึงข้อมูลทั้งหมด
router.get("/jobaplication/:id", listspecific); // ดึงข้อมูลเฉพาะ ID
router.put("/jobaplication/:id", update); // อัปเดตข้อมูล
router.delete("/jobaplication/:id", remove); // ลบข้อมูล

module.exports = router;