const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listCustomer = await prisma.customer.findMany();
    res.json({ listCustomer });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve customer records" });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      cus_company_name,
      contact_name,
      cus_address,
      cus_phone,
      cus_tax_id,
    } = req.body;

    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาหรือไม่
    if (!cus_company_name || !contact_name || !cus_phone || !cus_tax_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ตรวจสอบว่าหมายเลขโทรศัพท์เป็นตัวเลขและมีความยาวที่เหมาะสม
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(cus_phone)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    // ตรวจสอบว่าหมายเลขผู้เสียภาษี (cus_tax_id) เป็นตัวเลข 13 หลัก
    const taxIdRegex = /^[0-9]{13}$/;
    if (!taxIdRegex.test(cus_tax_id)) {
      return res
        .status(400)
        .json({ error: "Invalid tax ID format (must be 13 digits)" });
    }

    // สร้างข้อมูลลูกค้า
    const newCustomer = await prisma.customer.create({
      data: {
        cus_company_name,
        contact_name,
        cus_address,
        cus_phone,
        cus_tax_id,
      },
    });

    res.status(201).json({
      message: "Customer created successfully",
      newCustomer,
    });
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ error: "Failed to create customer" });
  }
};

exports.update = async (req, res) => {
  try {
      const { id } = req.params; // รับ ID ของลูกค้าที่ต้องการอัปเดต
      const {
          cus_company_name,
          contact_name,
          cus_address,
          cus_phone,
          cus_tax_id,
      } = req.body;

      // ตรวจสอบว่ามี ID หรือไม่
      if (!id) {
          return res.status(400).json({ error: "Customer ID is required" });
      }
      

      // ตรวจสอบว่าลูกค้ามีอยู่หรือไม่
      const existingCustomer = await prisma.customer.findUnique({
          where: { customer_id: Number(id) }, // เปลี่ยน id เป็น customer_id
      });

      if (!existingCustomer) {
          return res.status(404).json({ error: "Customer not found" });
      }

      // อัปเดตข้อมูลลูกค้า
      const updatedCustomer = await prisma.customer.update({
          where: { customer_id: Number(id) }, // เปลี่ยน id เป็น customer_id
          data: {
              cus_company_name,
              contact_name,
              cus_address,
              cus_phone,
              cus_tax_id,
          },
      });

      res.status(200).json({
          message: "Customer updated successfully",
          updatedCustomer,
      });
  } catch (err) {
      console.error("Error updating customer:", err);
      res.status(500).json({ error: "Failed to update customer" });
  }
};

  
exports.remove = async (req, res) => {
  try {
      const { id } = req.params; // รับ ID ของลูกค้าที่ต้องการลบ

      // ตรวจสอบว่ามี ID หรือไม่
      if (!id) {
          return res.status(400).json({ error: "Customer ID is required" });
      }

      // ตรวจสอบว่าลูกค้ามีอยู่หรือไม่
      const existingCustomer = await prisma.customer.findUnique({
          where: { customer_id: Number(id) }, // เปลี่ยน id เป็น customer_id
      });

      if (!existingCustomer) {
          return res.status(404).json({ error: "Customer not found" });
      }

      // ลบข้อมูลลูกค้า
      await prisma.customer.delete({
          where: { customer_id: Number(id) }, // เปลี่ยน id เป็น customer_id
      });

      res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
      console.error("Error deleting customer:", err);
      res.status(500).json({ error: "Failed to delete customer" });
  }
};
