const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listjobaplication = await prisma.jobApplication.findMany();
    res.json({ listjobaplication });
  } catch (err) {
    console.error("Error fetching employees: ", err.message);
  }
};
exports.create = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      job_position,
      expected_salary,
      documents,
      personal_info,
      phone_number,
      email,
      liveby,
      birth_date,
      age,
      ethnicity,
      nationality,
      religion,
      marital_status,
      military_status,
    } = req.body;

    // ดึงข้อมูลไฟล์ที่อัปโหลด
    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    // ตรวจสอบว่า email ซ้ำหรือไม่
    const checkemail = await prisma.jobApplication.findUnique({
      where: { email },
    });

    if (checkemail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // สร้างข้อมูลใหม่
    const newJobApplication = await prisma.jobApplication.create({
      data: {
        firstname,
        lastname,
        job_position,
        expected_salary: parseFloat(expected_salary), // แปลงค่าเงินเดือนเป็น Float
        documents,
        personal_info,
        phone_number,
        email,
        liveby,
        birth_date,
        age: parseInt(age), // แปลงอายุเป็น Int
        ethnicity,
        nationality,
        religion,
        marital_status,
        military_status,
        photo, // บันทึก URL รูปภาพ
      },
    });

    res.status(201).json({
      message: 'Job application created successfully',
      newJobApplication,
    });
  } catch (err) {
    console.error('Error creating job application:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstname,
      lastname,
      job_position,
      expected_salary,
      documents,
      personal_info,
      phone_number,
      email,
      liveby,
      birth_date,
      age,
      ethnicity,
      nationality,
      religion,
      marital_status,
      military_status,
      status,
      photo,
    } = req.body;

    // ตรวจสอบสถานะก่อนการอัปเดต
    const validStatus = ["new", "wait", "pass", "reject"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // ตรวจสอบว่า jobApplication ที่ต้องการอัปเดตมีอยู่หรือไม่
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        job_id: Number(id),
      },
    });

    if (!existingApplication) {
      return res
        .status(404)
        .json({ message: "Job application not found with the provided ID" });
    }

    // อัปเดตข้อมูล jobApplication
    const updatedApplication = await prisma.jobApplication.update({
      where: {
        job_id: Number(id),
      },
      data: {
        firstname,
        lastname,
        job_position,
        expected_salary,
        documents,
        personal_info,
        phone_number,
        email,
        liveby,
        birth_date,
        age,
        ethnicity,
        nationality,
        religion,
        marital_status,
        military_status,
        status,
        photo,
      },
    });

    // ส่งผลลัพธ์กลับไปยัง client
    res.status(200).json({
      message: "Job application updated successfully",
      application: updatedApplication,
    });
  } catch (err) {
    console.error("Error updating job application:", err.message);

    // ตรวจสอบข้อผิดพลาดของ Prisma
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Job application not found for update" });
    }

    // ข้อผิดพลาดทั่วไป
    res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.jobApplication.delete({
      where: {
        job_id: Number(id),
      },
    });

    res.json({ message: "Deleted succesfully", deleted });
  } catch (err) {
    console.error("Error deleting jobaaplication", err.message);
  }
};
