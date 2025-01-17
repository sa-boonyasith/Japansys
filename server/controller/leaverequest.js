const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listLeaveRequest = await prisma.leaveRequest.findMany();
    res.json({ listLeaveRequest });
  } catch (err) {
    console.log(err);
  }
};
exports.create = async (req, res) => {
  try {
    const { employee_id, leavetype, startdate, enddate } = req.body;

    // Validate employee_id
    if (!employee_id || isNaN(Number(employee_id))) {
      return res.status(400).json({ error: "Invalid or missing employee_id" });
    }

    // Validate that startdate and enddate are valid dates
    const validStartDate =
      startdate && !isNaN(new Date(startdate).getTime())
        ? new Date(startdate)
        : null;
    const validEndDate =
      enddate && !isNaN(new Date(enddate).getTime())
        ? new Date(enddate)
        : null;

    if (!validStartDate || !validEndDate) {
      return res.status(400).json({ error: "Invalid startdate or enddate" });
    }

    // Format dates to include time
    const formattedStartDate =
      validStartDate.toISOString().split("T")[0] + "T00:00:00.000Z";
    const formattedEndDate =
      validEndDate.toISOString().split("T")[0] + "T23:59:59.000Z";

    // Check if the employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: Number(employee_id) },
      select: { firstname: true, lastname: true },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Create the leave request
    const newRequest = await prisma.leaveRequest.create({
      data: {
        employee_id: Number(employee_id),
        firstname: employee.firstname,
        lastname: employee.lastname,
        leavetype,
        startdate: formattedStartDate,
        enddate: formattedEndDate,
      },
    });

    // Respond with the created leave request
    res.status(201).json({
      message: "LeaveRequest created successfully",
      newRequest,
    });
  } catch (err) {
    console.error("Error creating leave request:", err); // Log the full error for debugging
    res.status(500).json({ error: "Failed to create leave request" });
  }
};



exports.update = async (req, res) => {
  try {
    const { id } = req.params; 
    const existingRequest = await prisma.leaveRequest.findUnique({
      where: { leave_id: Number(id) },
    });

    if (!existingRequest) {
      return res.status(404).json({ message: "LeaveRequest not found for the given ID" });
    }
    const {
      employee_id, 
      leavetype,
      startdate,
      enddate,
      action,
      status,
    } = req.body;


    // ตรวจสอบว่ามี ID หรือไม่
    if (!id) {
      return res.status(400).json({ message: "ID parameter is required" });
    }

    // ตรวจสอบว่า employee_id ถูกส่งมาหรือไม่
    if (!employee_id) {
      return res
        .status(400)
        .json({ message: "Employee ID is required for updating" });
    }

    // ดึงข้อมูล employee จากฐานข้อมูล
    const employee = await prisma.employee.findUnique({
      where: { id: employee_id },
      select: { firstname: true, lastname: true },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // ตรวจสอบและแปลงวันที่
    const validStartDate =
      startdate && !isNaN(new Date(startdate).getTime())
        ? new Date(startdate)
        : null;
    const validEndDate =
      enddate && !isNaN(new Date(enddate).getTime()) ? new Date(enddate) : null;

    const formattedStartDate = validStartDate
      ? validStartDate.toISOString().split("T")[0] + "T00:00:00.000Z"
      : undefined;

    const formattedEndDate = validEndDate
      ? validEndDate.toISOString().split("T")[0] + "T23:59:59.000Z"
      : undefined;

    // อัปเดต LeaveRequest ในฐานข้อมูล
    const updatedLeaveRequest = await prisma.leaveRequest.update({
      where: { leave_id: Number(id) }, 
      data: {
        firstname: employee.firstname, 
        lastname: employee.lastname,
        leavetype,
        startdate: formattedStartDate,
        enddate: formattedEndDate,
        action,
        status,
      },
    });

    
    res.json({
      message: "LeaveRequest updated successfully",
      leaveRequest: updatedLeaveRequest,
    });
  } catch (err) {
    console.error("Error updating LeaveRequest:", err);

  
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ message: "LeaveRequest not found for the given ID" });
    }

 
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const existingRequest = await prisma.leaveRequest.findUnique({
      where: { leave_id: Number(id) },
    });

    if (!existingRequest) {
      return res.status(404).json({ message: "LeaveRequest not found for the given ID" });
    }
    const deleted = await prisma.leaveRequest.delete({
      where: {
        leave_id: Number(id),
      },
    });

    res.json({ message: "Deleted succesfully", deleted });
  } catch (err) {
    console.error("Error deleting information", err.message);
  }
};
