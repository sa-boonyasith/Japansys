const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listExpense = await prisma.expense.findMany();
    res.json({ listExpense });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve Expense records" });
  }
};

exports.create = async (req, res) => {
    try {
      const { employee_id, date, type_expense, money, desc } = req.body;
  
      // ตรวจสอบว่า employee_id ถูกส่งมาหรือไม่
      if (!employee_id) {
        return res
          .status(400)
          .json({ message: "Employee ID is required for creating expense" });
      }
  
      // ตรวจสอบว่า employee มีอยู่หรือไม่
      const employee = await prisma.employee.findUnique({
        where: { id: Number(employee_id) },
        select: { firstname: true, lastname: true }, // ดึง firstname และ lastname
      });
  
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      // สร้างค่าใช้จ่ายใหม่
      const newExpense = await prisma.expense.create({
        data: {
          employee_id: Number(employee_id),
          firstname: employee.firstname, // ใช้ firstname จาก Employee
          lastname: employee.lastname,  // ใช้ lastname จาก Employee
          date: new Date(date),         // แปลงวันที่ให้เป็น Date Object
          type_expense,
          money,
          desc,
        },
      });
  
      res.status(200).json({
        message: "Expense created successfully",
        data: newExpense,
      });
    } catch (err) {
      console.error("Error during Expense creation:", err.message);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  exports.update = async (req, res) => {
    try {
      const { id } = req.params; // รับ ID ของรายการที่ต้องการอัพเดทจาก URL parameters
      const { employee_id, date, type_expense, money, desc, status } = req.body;
  
      // ตรวจสอบว่ามี ID หรือไม่
      if (!id) {
        return res.status(400).json({ message: "Expense ID is required for updating" });
      }
  
      // ตรวจสอบว่า expense นี้มีอยู่หรือไม่
      const existingExpense = await prisma.expense.findUnique({
        where: { expen_id: Number(id) },
      });
  
      if (!existingExpense) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      // ตรวจสอบว่า employee_id ถูกส่งมาหรือไม่
      if (!employee_id) {
        return res.status(400).json({ message: "Employee ID is required for updating expense" });
      }
  
      // ตรวจสอบว่า employee มีอยู่หรือไม่
      const employee = await prisma.employee.findUnique({
        where: { id: Number(employee_id) },
        select: { firstname: true, lastname: true },
      });
  
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      // อัพเดทข้อมูล
      const updatedExpense = await prisma.expense.update({
        where: { expen_id: Number(id) },
        data: {
          employee_id: Number(employee_id),
          firstname: employee.firstname,
          lastname: employee.lastname,
          date: date ? new Date(date) : existingExpense.date,
          type_expense: type_expense || existingExpense.type_expense,
          money: money !== undefined ? money : existingExpense.money,
          desc: desc || existingExpense.desc, 
          status: status || existingExpense.status,
          
        },
      });
  
      res.status(200).json({
        message: "Expense updated successfully",
        data: updatedExpense,
      });
    } catch (err) {
      console.error("Error updating Expense:", err.message);
      res.status(500).json({ error: "Failed to update Expense", details: err.message });
    }
  };
  
exports.remove = async (req, res) => {
  try {
    const {id} = req.params;
    const deleted = await prisma.expense.delete({
        where:{
            expen_id:Number(id)
        }
    })
    res.json({ message: "Deleted succesfully", deleted });

  } catch (err) {
    console.error("Error deleting Meetingroom", err.message);
  }
};
