const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads"); // เพิ่ม upload middleware
const { create, list, update, remove, listspecific } = require("../controller/jobaplication");

// อัปโหลดหลายไฟล์พร้อมกัน (photo 1 รูป, documents ได้สูงสุด 5 ไฟล์)
router.post("/jobaplication", 
  upload.fields([
    { name: "photo", maxCount: 1 }, 
    { name: "documents", maxCount: 5 }
  ]), 
  create
);

// Routes อื่นๆ
router.get("/jobaplication", list);
router.get("/jobaplication/:id", listspecific);
router.put("/jobaplication/:id", update);
router.delete("/jobaplication/:id", remove);

module.exports = router;
