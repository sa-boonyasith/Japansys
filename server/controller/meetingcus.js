const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listmeetingcustomer = await prisma.meetingcus.findMany();
    res.json({ listmeetingcustomer });
  } catch (err) {
    console.error("Error fetching customer meetings:", err.message);
    res.status(500).json({ error: "Failed to fetch customer meetings" });
  }
};

exports.create = async (req, res) => {
  try {
    const { customer_id, startdate, enddate, timestart, timeend } = req.body;

    // ตรวจสอบ startdate และ enddate ให้เป็น YYYY-MM-DD เท่านั้น
    const validStartDate = startdate ? startdate.split("T")[0] : null;
    const validEndDate = enddate ? enddate.split("T")[0] : null;

    if (!validStartDate || !validEndDate) {
      return res.status(400).json({ error: "Invalid startdate or enddate" });
    }

 

    // ค้นหา customer
    const customer = await prisma.customer.findUnique({
      where: { customer_id: Number(customer_id) },
      select: {
        cus_company_name: true,
        contact_name: true,
        cus_position: true,
        cus_address: true,
        cus_phone: true,
        cus_tax_id: true,
        cus_bankname: true,
        cus_banknumber: true,
      },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // สร้าง meetingcus โดยบันทึก startdate-enddate เป็น String (YYYY-MM-DD) และ timestart-timeend เป็น String (HH:mm:ss)
    const newMeeting = await prisma.meetingcus.create({
      data: {
        customer_id: Number(customer_id),
        cus_company_name: customer.cus_company_name,
        contact_name: customer.contact_name,
        cus_postition: customer.cus_position,
        cus_address: customer.cus_address,
        cus_phone: customer.cus_phone,
        cus_tax_id: customer.cus_tax_id,
        cus_bankname: customer.cus_bankname,
        cus_banknumber: customer.cus_banknumber,
        startdate: validStartDate, 
        enddate: validEndDate, 
        timestart,
        timeend,
      },
    });

    res.status(201).json({
      message: "Customer meeting created successfully",
      newMeeting,
    });
  } catch (err) {
    console.error("Error creating customer meeting:", err);
    res.status(500).json({ error: "Failed to create customer meeting" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, startdate, enddate, timestart, timeend, status } =
      req.body;


    if (!customer_id) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    // ตรวจสอบ startdate และ enddate ให้เป็น YYYY-MM-DD เท่านั้น
    const validStartDate = startdate ? startdate.split("T")[0] : null;
    const validEndDate = enddate ? enddate.split("T")[0] : null;

    if (!validStartDate || !validEndDate) {
      return res.status(400).json({ error: "Invalid startdate or enddate" });
    }

    // ค้นหา customer
    const customer = await prisma.customer.findUnique({
      where: { customer_id: Number(customer_id) },
      select: {
        cus_company_name: true,
        contact_name: true,
        cus_position: true,
        cus_address: true,
        cus_phone: true,
        cus_tax_id: true,
        cus_bankname: true,
        cus_banknumber: true,
      },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // อัปเดต meetingcus โดยบันทึก startdate, enddate เป็น String (YYYY-MM-DD)
    const updatedMeeting = await prisma.meetingcus.update({
      where: { meeting_cus: Number(id) },
      data: {
        customer_id: Number(customer_id),
        cus_company_name: customer.cus_company_name,
        contact_name: customer.contact_name,
        cus_postition: customer.cus_position,
        cus_address: customer.cus_address,
        cus_phone: customer.cus_phone,
        cus_tax_id: customer.cus_tax_id,
        cus_bankname: customer.cus_bankname,
        cus_banknumber: customer.cus_banknumber,
        startdate: validStartDate,
        enddate: validEndDate,
        timestart,
        timeend,
        status,
      },
    });

    res.status(200).json({
      message: "Customer meeting updated successfully",
      updatedMeeting,
    });
  } catch (err) {
    console.error("Error updating customer meeting:", err);
    res.status(500).json({ error: "Failed to update customer meeting" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.meetingcus.delete({
      where: {
        meeting_cus: Number(id),
      },
    });

    res.json({ message: "Customer meeting deleted successfully" });
  } catch (err) {
    console.error("Error deleting customer meeting:", err.message);
    res.status(500).json({ error: "Failed to delete customer meeting" });
  }
};
