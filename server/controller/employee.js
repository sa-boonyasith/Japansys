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
        banking_id,
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
    const {id} = req.params
    const deleted = await prisma.employee.delete({
        where : {
            id: Number(id)
        }
    })
    res.json({message: "Deleted succesfully",deleted});
} catch (err) {
  console.error("Error deleting employee",err.message)
}
};
