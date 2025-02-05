const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listExpense = await prisma.expense.findMany();
    res.json({ listExpense });
  } catch (err) {
    console.error("Error retrieving Expense records:", err);
    res.status(500).json({ error: "Failed to retrieve Expense records" });
  }
};

exports.create = async (req, res) => {
  try {
    const { employee_id, date, type_expense, money, desc } = req.body;

    if (!employee_id) {
      return res
        .status(400)
        .json({ message: "Employee ID is required for creating expense" });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: Number(employee_id) },
      select: { firstname: true, lastname: true },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // ตรวจสอบค่า money ว่าเป็นตัวเลขหรือไม่
    const expenseMoney = parseInt(money);
    if (isNaN(expenseMoney)) {
      return res.status(400).json({ message: "Money must be a valid number" });
    }

    // ตรวจสอบค่าวันที่
    const expenseDate = new Date(date);
    if (isNaN(expenseDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const newExpense = await prisma.expense.create({
      data: {
        employee_id: Number(employee_id),
        firstname: employee.firstname,
        lastname: employee.lastname,
        date: expenseDate,
        type_expense,
        money: expenseMoney,
        desc,
      },
    });

    res.status(200).json({
      message: "Expense created successfully",
      data: newExpense,
    });
  } catch (err) {
    console.error("Error during Expense creation:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, date, type_expense, money, desc, status } = req.body;

    const expenseId = Number(id);
    if (isNaN(expenseId)) {
      return res
        .status(400)
        .json({ message: "Expense ID must be a valid number" });
    }

    const existingExpense = await prisma.expense.findUnique({
      where: { expen_id: expenseId },
    });

    if (!existingExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (!employee_id) {
      return res
        .status(400)
        .json({ message: "Employee ID is required for updating expense" });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: Number(employee_id) },
      select: { firstname: true, lastname: true },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const expenseMoney =
      money !== undefined ? parseInt(money) : existingExpense.money;
    if (money !== undefined && isNaN(expenseMoney)) {
      return res.status(400).json({ message: "Money must be a valid number" });
    }

    const expenseDate = date ? new Date(date) : existingExpense.date;
    if (date && isNaN(expenseDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const updatedExpense = await prisma.expense.update({
      where: { expen_id: expenseId },
      data: {
        employee_id: Number(employee_id),
        firstname: employee.firstname,
        lastname: employee.lastname,
        date: expenseDate,
        type_expense: type_expense || existingExpense.type_expense,
        money: expenseMoney,
        desc: desc || existingExpense.desc,
        status: status || existingExpense.status,
      },
    });

    res.status(200).json({
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (err) {
    console.error("Error updating Expense:", err);
    res
      .status(500)
      .json({ error: "Failed to update Expense", details: err.message });
  }
};

exports.remove = async (req, res) => {
    try {
      console.log("Request params:", req.params); // ✅ Debug
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: "Expense ID is required for deletion" });
      }
  
      console.log("Parsed ID:", Number(id)); // ✅ Debug
  
      const existingExpense = await prisma.expense.findUnique({
        where: { expen_id: Number(id) },
      });
  
      console.log("Existing Expense:", existingExpense); // ✅ Debug
  
      if (!existingExpense) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      await prisma.expense.delete({
        where: { expen_id: Number(id) },
      });
  
      return res.status(204).send();
    } catch (err) {
      console.error("Error deleting Expense:", err);
      return res.status(500).json({ error: "Failed to delete Expense", details: err.message });
    }
  };
  
