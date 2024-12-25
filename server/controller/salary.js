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
      return res
        .status(400)
        .json({ error: "Salary record already exists for this employee" });
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
  try {
    const { employee_id, salary, bonus } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    // Retrieve the attendance records for the employee
    const attendrecord = await prisma.attend.findMany({
      where: { employee_id: employee_id },
      select: { working_hours: true },
    });

    const avgworkinghours = 8.5; // 8.5 hours (average)
    const overtimeRate = 340; // 1 hour overtime = 340
    let totalovertimehours = 0;

    // Calculate total overtime hours
    attendrecord.forEach((record) => {
      if (record.working_hours > avgworkinghours) {
        totalovertimehours += record.working_hours - avgworkinghours;
      }
    });

    // Calculate the overtime pay
    const overtimePay = totalovertimehours * overtimeRate;

    // Calculate the updated salary (base salary + bonus + overtime)
    const updatedsalary = salary + bonus + overtimePay;

    // Check if the employee has an existing salary record
    const existingSalary = await prisma.salary.findFirst({
      where: { employee_id: employee_id },
    });

    if (existingSalary) {
      // Update the existing salary record by employee_id
      await prisma.salary.update({
        where: { employee_id: employee_id }, // Use employee_id in the where clause
        data: {
          salary_total: updatedsalary,
          overtime: overtimePay,
          bonus: bonus,
        },
      });

      // Update the employee's salary in the Employee table
      await prisma.employee.update({
        where: { id: employee_id },
        data: {
          salary: updatedsalary,
        },
      });
    } else {
      // If no salary record exists, create a new one
      await prisma.salary.create({
        data: {
          employee_id: employee_id,
          salary_total: updatedsalary,
          overtime: overtimePay,
          bonus: bonus,
          created_at: new Date(), // You can adjust the timestamp if needed
        },
      });
    }

    res.status(200).json({
      message: "Salary updated successfully",
      employee_id,
      updatedsalary,
      overtimePay,
      bonus,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update salary record" });
  }
};


exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existingSalary = await prisma.salary.findUnique({
      where: { salary_id: Number(id) },
    });
    if (!existingSalary) {
      return res.status(404).json({ error: "Salary record not found" });
    }
    const deleted = await prisma.salary.delete({
      where: {
        salary_id: Number(id),
      },
    });

    res.json({ message: "Salary record deleted successfully", deleted });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete salary record" });
  }
};
