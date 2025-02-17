const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listemployee = await prisma.employee.findMany()
    res.json({listemployee})
  } catch (err) {
    console.log(err)
  }
};
exports.create = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      job_position,
      salary,
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
      photo,
    } = req.body;

    // Check if email already exists in the Employee table
    const checkemail = await prisma.employee.findUnique({
      where: { email },
    });

    if (checkemail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Convert birth_date to a Date object
    const formattedBirthDate = birth_date ? new Date(birth_date) : null;

    const formattedBankingId = banking_id ? String(banking_id) : null;

    // Create new employee
    const newEmployee = await prisma.employee.create({
      data: {
        firstname,
        lastname,
        job_position,
        salary,
        documents,
        personal_info,
        phone_number,
        email,
        liveby,
        birth_date: formattedBirthDate,
        age,
        ethnicity,
        nationality,
        religion,
        marital_status,
        military_status,
        banking,
        banking_id: formattedBankingId,
        photo,
      },
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (err) {
    console.error("Error creating employee:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id} = req.params
    const {
        firstname,
        lastname,
        job_position,
        salary,
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
        photo,
        role,
      } = req.body;

      const formattedBirthDate = birth_date ? new Date(birth_date) : null;

      const  update = await prisma.employee.update({
        where : {
            id : Number(id)
        },
        data:{
            firstname,
        lastname,
        job_position,
        salary,
        documents,
        personal_info,
        phone_number,
        email,
        liveby,
        birth_date: formattedBirthDate,
        age,
        ethnicity,
        nationality,
        religion,
        marital_status,
        military_status,
        banking,
        banking_id,
        photo,
        role,
        }
      })

      res.json({ message: "Information Updated successfully", update });
    } catch (err) {
      console.error("Error updating employee:", err.message);
    }
  };
  exports.remove = async (req, res) => {
    try {
      const { id } = req.params;
      const employeeId = Number(id);
  
      // ตรวจสอบว่ามีพนักงานอยู่จริงหรือไม่
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
      });
  
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      // ใช้ transaction เพื่อลบข้อมูลที่เกี่ยวข้องทั้งหมดก่อนลบ Employee
      await prisma.$transaction([
        prisma.todo.deleteMany({ where: { employee_id: employeeId } }),
        prisma.project.deleteMany({ where: { employee_id: employeeId } }),
        prisma.salary.deleteMany({ where: { employee_id: employeeId } }),
        prisma.attendance.deleteMany({ where: { employee_id: employeeId } }),
        prisma.expense.deleteMany({ where: { employee_id: employeeId } }),
        prisma.user.deleteMany({ where: { employee_id: employeeId } }), // ถ้ามีบัญชีผู้ใช้ที่เชื่อมโยง
        prisma.employee.delete({ where: { id: employeeId } }),
      ]);
  
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      console.error("Error deleting employee:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  