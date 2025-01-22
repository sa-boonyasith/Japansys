const prisma = require("../config/prisma");
const cron = require("node-cron");

cron.schedule("0 0 * * *", async () => {
  try {
    // Reset fields for attendance records that are not null
    await prisma.attend.updateMany({
      where: {
        check_in_time: {
          not: null,
        },
      },
      data: {
        check_in_time: null,
        check_out_time: null,
        working_hours: null,
        status: "not_checked_in",
      },
    });

    console.log("Attendance records reset successfully at midnight");
  } catch (error) {
    console.error("Error resetting attendance records:", error);
  }
});

exports.list = async (req, res) => {
  try {
    const listAttend = await prisma.attend.findMany();
    res.json(listAttend);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve attendance records" });
  }
};

exports.create = async (req, res) => {
  try {
    const { employee_id } = req.body;

    const todayCheckIn = await prisma.attend.findFirst({
      where: {
        employee_id,
        check_out_time: null,
      },
    });

    if (todayCheckIn) {
      return res
        .status(400)
        .json({ error: "Employee has already checked in today" });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employee_id },
      select: { firstname: true, lastname: true },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const newAttend = await prisma.attend.create({
      data: {
        employee_id,
        firstname: employee.firstname,
        lastname: employee.lastname,
        check_in_time: new Date(), // Use local time
        check_out_time: null,
        status: "check_in",
      },
    });

    res.json({ message: "Check in successfully", newAttend });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

exports.update = async (req, res) => {
  try {
    const { employee_id } = req.body;
    if (!employee_id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const attend = await prisma.attend.findFirst({
      where: {
        employee_id,
        check_out_time: null,
      },
      orderBy: {
        check_in_time: "desc",
      },
    });

    if (!attend) {
      return res
        .status(404)
        .json({ error: "No check-in record found for the employee" });
    }

    const checkindate = new Date(attend.check_in_time).toDateString();
    const currentDate = new Date().toDateString();
    if (checkindate !== currentDate) {
      return res
        .status(400)
        .json({ error: "Employee has not checked in today" });
    }

    const checkInTime = new Date(attend.check_in_time);
    const checkOutTime = new Date(); // Use local time for checkout
    const workingHours = (checkOutTime - checkInTime) / 1000 / 60 / 60;

    const checkout = await prisma.$transaction(async (prisma) => {
      return await prisma.attend.update({
        where: {
          attend_id: attend.attend_id,
        },
        data: {
          check_out_time: checkOutTime,
          working_hours: parseFloat(workingHours.toFixed(2)),
          status: "check_out",
        },
      });
    });

    res.json({ message: "Check out successfully", data: checkout });
  } catch (err) {
    console.error("Error during check-out:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    // Fetch all attend records
    const attend = await prisma.attend.findMany();

    // Map the records for attendhistory
    const attendhistory = attend.map((attend) => ({
      attend_id: attend.attend_id, // Use the correct field name
      employee_id: attend.employee_id,
      firstname: attend.firstname,
      lastname: attend.lastname,
      check_in_time: attend.check_in_time,
      check_out_time: attend.check_out_time,
      working_hours: attend.working_hours,
      status: attend.status,
    }));

    // Use a transaction to move the data to history and delete from attend table
    await prisma.$transaction([
      prisma.attendhistory.createMany({
        data: attendhistory, // Correct field structure for createMany
      }),
      prisma.attend.deleteMany({
        where: {
          attend_id: {
            in: attend.map((a) => a.attend_id), // Correct mapping for deletion
          },
        },
      }),
    ]);

    // Respond with success
    res.json({
      message: "Attendance records moved to history and deleted successfully",
    });
  } catch (err) {
    console.error(err); // More detailed error logging
    res.status(500).json({ error: "Failed to remove attendance record" });
  }
};
