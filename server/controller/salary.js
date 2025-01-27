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
    const {
      employee_id,
      payroll_startdate,
      payroll_enddate,
      payment_date,
      bonus = 0,
    } = req.body;

    // Validate required fields
    if (!employee_id || !payroll_startdate || !payroll_enddate || !payment_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate date logic
    if (new Date(payroll_enddate) <= new Date(payroll_startdate)) {
      return res.status(400).json({ error: "Payroll end date must be after start date" });
    }

    if (new Date(payment_date) < new Date(payroll_enddate)) {
      return res.status(400).json({ error: "Payment date must be after payroll end date" });
    }

    // Fetch employee details
    const employee = await prisma.employee.findUnique({
      where: { id: employee_id },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const { job_position, salary, firstname, lastname, banking, banking_id } = employee;

    // Fetch attendance records
    const attendanceRecords = await prisma.attend.findMany({
      where: {
        employee_id,
        check_in_time: {
          gte: new Date(payroll_startdate),
          lte: new Date(payroll_enddate),
        },
      },
    });

    let absent_late = 0;
    let overtime = 0;

    attendanceRecords.forEach((record) => {
      if (!record.check_in_time) {
        absent_late += 1; // Missing check-in counts as absent
      } else {
        const checkInTime = new Date(record.check_in_time);
        const workHours = record.working_hours || 0;

        // Count late arrivals (after 9:00 AM)
        if (checkInTime.getHours() > 9 || (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 0)) {
          absent_late += 1;
        }

        // Calculate overtime
        if (workHours > 8.5) {
          overtime += Math.floor(workHours - 8.5) * 1000; // Add 1000 per overtime hour
        }
      }
    });

    // Fetch expense records
    const expenses = await prisma.expense.findMany({
      where: {
        employee_id,
        date: {
          gte: new Date(payroll_startdate),
          lte: new Date(payroll_enddate),
        },
        status: "Allowed", // Include only "allowed" expenses
      },
      select: {
        money: true,
      },
    });

    const totalExpenses = expenses.reduce((total, exp) => total + exp.money, 0);

    

    // Calculate tax based on salary ranges
    const calculateTax = (income) => {
      let tax = 0;
      if (income > 5000000) {
        tax += (income - 5000000) * 0.35;
        income = 5000000;
      }
      if (income > 2000000) {
        tax += (income - 2000000) * 0.30;
        income = 2000000;
      }
      if (income > 1000000) {
        tax += (income - 1000000) * 0.25;
        income = 1000000;
      }
      if (income > 750000) {
        tax += (income - 750000) * 0.20;
        income = 750000;
      }
      if (income > 500000) {
        tax += (income - 500000) * 0.15;
        income = 500000;
      }
      if (income > 300000) {
        tax += (income - 300000) * 0.10;
        income = 300000;
      }
      if (income > 150000) {
        tax += (income - 150000) * 0.05;
      }
      return tax;
    };

    const tax = calculateTax(salary);
    const providentfund = salary * 0.03; // Example: 3% provident fund
    const socialsecurity = Math.min(salary, 15000) * 0.05; // Example: 5% social security (max salary capped at 15,000)

    // Calculate tax_total and salary_total
    const tax_total = tax + providentfund + socialsecurity;
    const salary_total = salary - tax_total + overtime + bonus - absent_late - totalExpenses;

    // Create salary record
    const newSalary = await prisma.salary.create({
      data: {
        employee_id,
        firstname,
        lastname,
        position: job_position,
        payroll_startdate: new Date(payroll_startdate),
        payroll_enddate: new Date(payroll_enddate),
        payment_date: new Date(payment_date),
        banking,
        banking_id,
        salary,
        absent_late,
        overtime,
        bonus,
        tax,
        providentfund,
        socialsecurity,
        expense: totalExpenses,
        tax_total,
        salary_total,
      },
    });

    res.status(201).json(newSalary);
  } catch (err) {
    console.error("Error creating salary record:", err);
    res.status(500).json({ error: "Failed to create salary record", details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {
      employee_id,
      payroll_startdate,
      payroll_enddate,
      payment_date,
      bonus = 0,
      tax = 0,
      providentfund = 0,
      socialsecurity = 0,
      status,
    } = req.body;

    const { id } = req.params;

    // Validate required fields
    if (!id || isNaN(id) || !employee_id || !payroll_startdate || !payroll_enddate || !payment_date) {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    // Validate date logic
    if (new Date(payroll_enddate) <= new Date(payroll_startdate)) {
      return res.status(400).json({ error: "Payroll end date must be after start date" });
    }

    if (new Date(payment_date) < new Date(payroll_enddate)) {
      return res.status(400).json({ error: "Payment date must be after payroll end date" });
    }

    // Check if salary record exists
    const existingSalary = await prisma.salary.findUnique({
      where: { salary_id: Number(id) },
    });

    if (!existingSalary) {
      return res.status(404).json({ error: "Salary record not found" });
    }

    // Fetch employee details
    const employee = await prisma.employee.findUnique({
      where: { id: Number(employee_id) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const { job_position, salary, firstname, lastname, banking, banking_id } = employee;

    // Fetch attendance records
    const attendanceRecords = await prisma.attend.findMany({
      where: {
        employee_id: Number(employee_id),
        check_in_time: {
          gte: new Date(payroll_startdate),
          lte: new Date(payroll_enddate),
        },
      },
    });

    let absent_late = 0;
    let overtime = 0;

    attendanceRecords.forEach((record) => {
      if (!record.check_in_time) {
        absent_late += 1; // Missing check-in counts as absent
      } else {
        const checkInTime = new Date(record.check_in_time);
        const workHours = record.working_hours || 0;

        // Count late arrivals (after 9:00 AM)
        if (checkInTime.getHours() > 9 || (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 0)) {
          absent_late += 1;
        }

        // Calculate overtime
        if (workHours > 8.5) {
          overtime += Math.floor(workHours - 8.5) * 1000; // Add 1000 per overtime hour
        }
      }
    });

    // Fetch expense records
    const expenses = await prisma.expense.findMany({
      where: {
        employee_id: Number(employee_id),
        date: {
          gte: new Date(payroll_startdate),
          lte: new Date(payroll_enddate),
        },
        status: "Allowed", // Include only "allowed" expenses
      },
      select: {
        money: true,
      },
    });

    const totalExpenses = expenses.reduce((total, exp) => total + exp.money, 0);

    // Calculate tax_total and salary_total
    const tax_total = tax + providentfund + socialsecurity;
    const salary_total = salary - tax_total + overtime + bonus - absent_late - totalExpenses;

    // Update the existing salary record
    const updatedSalary = await prisma.salary.update({
      where: { salary_id: Number(id) },
      data: {
        employee_id: Number(employee_id),
        payroll_startdate: new Date(payroll_startdate),
        payroll_enddate: new Date(payroll_enddate),
        payment_date: new Date(payment_date),
        firstname,
        lastname,
        position: job_position,
        banking,
        banking_id,
        salary,
        absent_late,
        overtime,
        bonus,
        tax,
        providentfund,
        socialsecurity,
        expense: totalExpenses,
        tax_total,
        salary_total,
        status,
      },
    });

    res.status(200).json({ message: "Salary updated successfully", updatedSalary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update salary record", details: err.message });
  }
};







exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate and parse the salary ID
    const salaryId = parseInt(id, 10);
    if (isNaN(salaryId)) {
      return res.status(400).json({ error: "Invalid salary ID" });
    }

    // Check if the salary record exists
    const existingSalary = await prisma.salary.findUnique({
      where: { salary_id: salaryId },
    });

    if (!existingSalary) {
      return res.status(404).json({ error: "Salary record not found" });
    }

    // Delete the salary record
    const deletedSalary = await prisma.salary.delete({
      where: { salary_id: salaryId },
    });

    res.status(200).json({
      message: "Salary record deleted successfully",
      deletedSalary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to delete salary record",
      details: err.message,
    });
  }
};
