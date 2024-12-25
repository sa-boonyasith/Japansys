const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listSalary = await prisma.salary.findMany();
    res.json({ listSalary });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve salary records" });
  }
};
exports.create = async (req, res) => {
  try {
    const { employee_id, salary } = req.body;

    // Find the employee based on the given employee_id
    const employee = await prisma.employee.findUnique({
      where: { id: employee_id },
      select: { firstname: true, lastname: true },
    });

    // If the employee doesn't exist, return an error
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check if the employee already has a salary record
    const existingSalary = await prisma.salary.findFirst({
      where: { employee_id },
    });

    if (existingSalary) {
      return res.status(400).json({ error: "Salary record already exists for this employee" });
    }

    // Create a new salary record
    const newSalary = await prisma.salary.create({
      data: {
        employee_id,
        firstname: employee.firstname,
        lastname: employee.lastname,
        salary,
      },
    });

    // Respond with the created salary data
    res.status(201).json({
      message: "Salary created successfully",
      data: newSalary,
    });
  } catch (err) {
    // Error handling
    console.error("Error during salary creation:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.update = async (req, res) => {
  try{
    const {employee_id,salary,bonus} = req.body

    if(!employee_id){
      return res.status(400).json({error:"Employee ID is required"})
    }

    const attendrecord = await prisma.attend.findMany({
      where:{employee_id:employee_id},
      select:{working_hours:true}
    })

    const avgworkinghours = 8.5
    const overtimeRate = 340
    let totalovertimehours = 0

    

  }catch(err){
    console.log(err)
    res.status(500).json({error:"fail to update salary"})
  }
}
exports.remove = async (req, res) => {
  try{
    const {id} = req.params
    const existingSalary = await prisma.salary.findUnique({
      where:{salary_id:Number(id)}
    })
    if(!existingSalary){
      return res.status(404).json({error:"Salary record not found"})
    }
    const deleted = await prisma.salary.delete({
      where:{
        salary_id:Number(id)
      }
    })

    res.json({message:"Salary record deleted successfully",deleted})

  }catch(err){
    console.log(err)
    res.status(500).json({error:"Failed to delete salary record"})
  }
}
