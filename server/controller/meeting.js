const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listmeetingroom = await prisma.meetingroom.findMany();
    res.json({ listmeetingroom });
  } catch (err) {
    console.error("Error fetching meeting rooms:", err.message);
    res.status(500).json({ error: "Failed to fetch meeting rooms" });
  }
};

exports.create = async (req, res) => {
  try {
    const { employee_id, startdate, enddate, timestart, timeend } = req.body;

    const validStartDate =
      startdate && !isNaN(new Date(startdate).getTime())
        ? new Date(startdate)
        : null;
    const validEndDate =
      enddate && !isNaN(new Date(enddate).getTime()) ? new Date(enddate) : null;

    if (!validStartDate || !validEndDate) {
      return res.status(400).json({ error: "Invalid startdate or enddate" });
    }

    const formattedStartDate =
      validStartDate.toISOString().split("T")[0] + "T00:00:00.000Z";
    const formattedEndDate =
      validEndDate.toISOString().split("T")[0] + "T23:59:59.000Z";

    const employee = await prisma.employee.findUnique({
      where: { id: employee_id },
      select: { firstname: true, lastname: true },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const newmeetingroom = await prisma.meetingroom.create({
      data: {
        employee_id,
        firstname: employee.firstname,
        lastname: employee.lastname,
        startdate: formattedStartDate,
        enddate: formattedEndDate,
        timestart,
        timeend,
      },
    });

    res.status(201).json({
      message: "Meetingroom created successfully",
      newmeetingroom,
    });
  } catch (err) {
    console.log("Error creating Meeting room:", err);
    res.status(500).json({ error: "Failed to create Meeting room" });
  }
};
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, startdate, enddate, timestart, timeend, status } =
      req.body;

    if (!id) {
      return res.status(400).json({ message: "ID parameter is required" });
    }

    if (!employee_id) {
      return res
        .status(400)
        .json({ message: "Employee ID is required for updating" });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employee_id },
      select: { firstname: true, lastname: true },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const validStartDate =
      startdate && !isNaN(new Date(startdate).getTime())
        ? new Date(startdate)
        : null;
    const validEndDate =
      enddate && !isNaN(new Date(enddate).getTime()) ? new Date(enddate) : null;

    if (!validStartDate || !validEndDate) {
      return res.status(400).json({ error: "Invalid startdate or enddate" });
    }

    const formattedStartDate =
      validStartDate.toISOString().split("T")[0] + "T00:00:00.000Z";
    const formattedEndDate =
      validEndDate.toISOString().split("T")[0] + "T23:59:59.000Z";

    const update = await prisma.meetingroom.update({
      where: {
        meeting_id: Number(id),
      },
      data: {
        firstname: employee.firstname,
        lastname: employee.lastname,
        startdate: formattedStartDate,
        enddate: formattedEndDate,
        timestart,
        timeend,
        status,
      },
    });

    res.status(201).json({
      message: "Meetingroom created successfully",
      update,
    });
  } catch (err) {
    console.log("Error updating Meeting room:", err);
    res.status(500).json({ error: "Failed to update Meeting room" });
  }
};
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.meetingroom.delete({
      where: {
        meeting_id: Number(id),
      },
    });

    res.json({ message: "Deleted succesfully", deleted });
  } catch (err) {
    console.error("Error deleting Meetingroom", err.message);
  }
};
