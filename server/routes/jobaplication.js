const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads'); // เพิ่ม upload middleware
const { create, list, update, remove } = require('../controller/jobaplication');

// เพิ่ม middleware upload.single('photo') สำหรับอัปโหลดไฟล์ใน route create
router.post('/jobaplication', upload.single('photo'), create);

// Routes อื่นๆ
router.get('/jobaplication', list);
router.put('/jobaplication/:id', update);
router.delete('/jobaplication/:id', remove);

module.exports = router;
