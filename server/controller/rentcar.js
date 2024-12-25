const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listrentcar = await prisma.rentcar.findMany();
    res.json({listrentcar });
   
  } catch (err) {
    console.log(err);
  }
};
exports.create = async (req, res) => {
  try {
    const {
      employee_id,
      startdate,
      enddate,
      timestart,
      timeend,
      place,
      car,
    } = req.body;

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
  
    const newrentcar = await prisma.rentcar.create({
      data: {
        employee_id,
        firstname:employee.firstname,
        lastname:employee.lastname,
        startdate: formattedStartDate,
        enddate: formattedEndDate,
        timestart,
        timeend,
        place,
        car,
      },
    });

    res.status(201).json({
      message: "Rentcar created successfully",
      newrentcar,
    });
  } catch (err) {
    console.log("Error creating Rentcar :", err);
    res.status(500).json({ error: "Failed to create Rentcar" });
  }
};
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employee_id,
      startdate,
      enddate,
      timestart,
      timeend,
      status,
    } = req.body;

    const employee = await prisma.employee.findUnique({
        where: { id: employee_id },
        select: { firstname: true, lastname: true },
      });
  
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
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

    const update = await prisma.rentcar.update({
      where: {
        rentcar_id: Number(id),
      },
      data: {
        employee_id,
        firstname:employee.firstname,
        lastname:employee.lastname,
        startdate: formattedStartDate,
        enddate: formattedEndDate,
        timestart,
        timeend,
        status,
      },
    });

    res.status(201).json({
      message: "Rentcar created successfully",
      update,
    });
  } catch (err) {
    console.log("Error updateing Rentcar:", err);
    res.status(500).json({ error: "Failed to update Rentcar" });
  }
};
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.rentcar.delete({
      where: {
        meeting_id: Number(id),
      },
    });

    res.json({ message: "Deleted succesfully", deleted });
  } catch (err) {
    console.error("Error deleting Meetingroom", err.message);
  }
};
