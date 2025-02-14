const prisma = require("../config/prisma");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

exports.list = async (req, res) => {
  try {
    const listjobaplication = await prisma.jobApplication.findMany();
    res.json({ listjobaplication });
  } catch (err) {
    console.error("Error fetching employees: ", err.message);
  }
};

exports.listspecific = async (req,res) =>{
  const id = parseInt(req.params.id);

  try {
    const application = await prisma.jobApplication.findUnique({
      where: { job_id: id },
      select: {
        firstname: true,
        lastname: true,
        job_position: true,
        expected_salary: true,
        phone_number: true,
        email: true,
        personal_info: true,
        documents: true,
        liveby: true,
        birth_date: true,
        age: true,
        ethnicity: true,
        nationality: true,
        religion: true,
        marital_status: true,
        military_status: true,
        status: true,
        photo: true,
      },
    });

    if (!application) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching job application' });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      job_position,
      expected_salary,
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
      banking,
      banking_id,
    } = req.body;

    // แปลง JSON string ให้เป็น object (ถ้ามี)
    const personal_info = req.body.personal_info ? JSON.parse(req.body.personal_info) : null;

    // ดึงข้อมูลไฟล์ที่อัปโหลด
    const photo = req.files?.photo ? `/uploads/${req.files.photo[0].filename}` : null;

    // ดึงเอกสารทั้งหมดที่อัปโหลด
    const documents = req.files?.documents
      ? req.files.documents.map((file) => `/uploads/${file.filename}`)
      : [];

    // ตรวจสอบว่า email ซ้ำหรือไม่
    const checkemail = await prisma.jobApplication.findUnique({
      where: { email },
    });
 
    if (checkemail) {
      return res.status(400).json({ message: "Email already exists" });
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
        banking,
        banking_id,
      },
    });

    res.status(201).json({
      message: "Job application created successfully",
      newJobApplication,
    });
  } catch (err) {
    console.error("Error creating job application:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
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
      banking,
      banking_id,
      status,
    } = req.body;

    let updatedJobData = {};

    // ตรวจสอบว่าไฟล์ photo และ documents มีหรือไม่
    if (req.files?.photo) {
      updatedJobData.photo = `/uploads/${req.files.photo[0].filename}`;
    }

    if (req.files?.documents) {
      updatedJobData.documents = req.files.documents.map(
        (file) => `/uploads/${file.filename}`
      );
    }

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
        expected_salary: Number(expected_salary),
        documents: updatedJobData.documents || documents,
        personal_info,
        phone_number,
        email,
        liveby,
        birth_date,
        age: Number(age),
        ethnicity,
        nationality,
        religion,
        marital_status,
        military_status,
        banking,
        banking_id,
        status,
        photo: updatedJobData.photo || existingApplication.photo,
      },
    });

    res.status(200).json({
      message: "Job application updated successfully",
      application: updatedApplication,
      data: updatedJobData,
    });
  } catch (err) {
    console.error("Error updating job application:", err.message);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
exports.transfer = async (req, res) => {
  try {
    const { id } = req.params;

    // ดึงข้อมูล jobApplication ตาม ID
    const jobApplication = await prisma.jobApplication.findUnique({
      where: { job_id: Number(id) },
    });

    if (!jobApplication) {
      return res
        .status(404)
        .json({ message: "Job application not found with the provided ID" });
    }

    // ตรวจสอบว่ามี employee ที่ใช้อีเมลนี้อยู่แล้วหรือไม่
    const existingEmployee = await prisma.employee.findUnique({
      where: { email: jobApplication.email },
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: "This email is already registered as an employee",
      });
    }

    // สร้าง Employee ใหม่
    const newEmployee = await prisma.employee.create({
      data: {
        firstname: jobApplication.firstname,
        lastname: jobApplication.lastname,
        job_position: jobApplication.job_position,
        salary: jobApplication.expected_salary,
        phone_number: jobApplication.phone_number,
        email: jobApplication.email,
        personal_info: jobApplication.personal_info || {},
        documents: jobApplication.documents || [],
        liveby: jobApplication.liveby || "N/A",
        birth_date: jobApplication.birth_date ? new Date(jobApplication.birth_date) : null,
        age: jobApplication.age || 0,
        ethnicity: jobApplication.ethnicity || "N/A",
        nationality: jobApplication.nationality || "N/A",
        religion: jobApplication.religion || "N/A",
        marital_status: jobApplication.marital_status || "N/A",
        military_status: jobApplication.military_status || "N/A",
        photo: jobApplication.photo || "",
        role: "employee",
        banking: jobApplication.banking,
        banking_id: jobApplication.banking_id,
      },
    });

    // สร้าง Username ตามฟอร์แมต 2 ตัวอักษรจากนามสกุล.firstname@jpsys.th.com
    const lastnameInitials = jobApplication.lastname.substring(0, 2).toLowerCase();
    const username = `${lastnameInitials}.${jobApplication.firstname.toLowerCase()}@japansystem.co.th`;

    // Generate random password & hash it
    const randomPassword = uuidv4().substring(0, 8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // ตรวจสอบว่ามี user ที่ใช้อีเมลนี้อยู่แล้วหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email: username },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "This username/email is already in use",
      });
    }

    // สร้าง User ใหม่
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        email: username,
        role: "employee",
        firstname: jobApplication.firstname,
        lastname: jobApplication.lastname,
        employee_id: newEmployee.id,
      },
    });

    // ลบ jobApplication หลังจากที่ย้ายไปตาราง employee และสร้าง user เสร็จแล้ว
    await prisma.jobApplication.delete({
      where: { job_id: Number(id) },
    });

    res.status(200).json({
      message: "Job application approved, employee and user created successfully",
      employee: newEmployee,
      user: {
        username,
        password: randomPassword, // ส่งกลับรหัสผ่านที่สร้างให้ HR หรือผู้ใช้เปลี่ยนภายหลัง
        employee_id: newEmployee.id,
      },
    });
  } catch (err) {
    console.error("Error moving job application to employee:", err.message);
    res.status(500).json({ message: "Server error, please try again later" });
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
