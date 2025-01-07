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
      photo,
    } = req.body;

    // Check if email already exists
    const checkemail = await prisma.jobApplication.findUnique({
      where: { email },
    });

    if (checkemail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create new job application
    const newJobApplication = await prisma.jobApplication.create({
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
        birth_date, // ส่งเฉพาะ yyyy-mm-dd
        age,
        ethnicity,
        nationality,
        religion,
        marital_status,
        military_status,
        photo,
      },
    });

    res.status(201).json({
      message: "Job application created successfully",
      newJobApplication,
    });
  } catch (err) {
    console.error("Error creating Job application:", err.message);
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
      status,
    } = req.body;


    const update = await prisma.jobApplication.update({
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
      },
    });

    const validStatus = ["new", "wait", "pass", "reject"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    res.json({ message: "jobApplication Updated successfully", update });
  } catch (err) {
    console.error("Error updating jobapplication:", err.message);
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
