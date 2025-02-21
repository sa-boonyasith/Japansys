const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listQuotation = await prisma.quotation.findMany();
    res.json({ listQuotation });
  } catch (err) {
    console.error("Error retrieving Quotation records:", err);
    res.status(500).json({ error: "Failed to retrieve Quotation records" });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      customer_id,
      cus_name,
      tax_id,
      address,
      date,
      credit_term,
      contract_name,
      sale_name,
      project_name,
      no_item,
      description,
      quantity,
      price,
      discount,
      amount,
      subtotal,
      special_discount,
      after_discount,
      vat,
      total,
    } = req.body;

    // ตรวจสอบค่าที่จำเป็น
    if (!customer_id || !cus_name || !date || !sale_name || !project_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ตรวจสอบว่า customer_id มีอยู่ในฐานข้อมูล
    const existingCustomer = await prisma.customer.findUnique({
      where: { customer_id },
    });
    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // ตรวจสอบค่าว่างหรือค่าติดลบในฟิลด์ตัวเลข
    const numericFields = {
      credit_term,
      quantity,
      price,
      discount,
      subtotal,
      special_discount,
      after_discount,
      vat,
      total,
    };

    for (const [key, value] of Object.entries(numericFields)) {
      if (value < 0 || isNaN(value)) {
        return res.status(400).json({ error: `Invalid value for ${key}` });
      }
    }

    // แปลงวันที่ให้ถูกต้อง
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // สร้าง Quotation ใหม่
    const newQuotation = await prisma.quotation.create({
      data: {
        customer_id, // เชื่อมกับ customer
        cus_name,
        tax_id,
        address,
        date: formattedDate, // ใช้วันที่ที่แปลงแล้ว
        credit_term,
        contract_name,
        sale_name,
        project_name,
        no_item,
        description,
        quantity,
        price,
        discount,
        amount,
        subtotal,
        special_discount,
        after_discount,
        vat,
        total,
      },
    });

    res.status(201).json({
      message: "Quotation created successfully",
      data: newQuotation,
    });

  } catch (err) {
    console.error("Error creating Quotation:", err);
    res.status(500).json({ error: "Failed to create Quotation" });
  }
};

exports.update = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        cus_name,
        tax_id,
        address,
        date,
        credit_term,
        contract_name,
        sale_name,
        project_name,
        no_item,  // แก้จาก No_item
        description,
        quantity,
        price,
        discount,
        amount,
        subtotal,
        special_discount,
        after_discount,
        vat,
        total,
      } = req.body;
  
      // ตรวจสอบว่า ID ถูกส่งมาหรือไม่
      if (!id) {
        return res.status(400).json({ error: "Quotation ID is required" });
      }
  
      // ตรวจสอบว่ามีใบเสนอราคานี้อยู่หรือไม่
      const existingQuotation = await prisma.quotation.findUnique({
        where: { quotation_id: Number(id) },
      });
  
      if (!existingQuotation) {
        return res.status(404).json({ error: "Quotation not found" });
      }
  
      // ตรวจสอบค่าตัวเลขที่ไม่ควรเป็นค่าลบ
      if (quantity < 0 || price < 0 || discount < 0 || subtotal < 0 || vat < 0 || total < 0) {
        return res.status(400).json({ error: "Invalid numerical values" });
      }
  
      // แปลงวันที่ให้ถูกต้อง
      const formattedDate = new Date(date);
      if (isNaN(formattedDate)) {
        return res.status(400).json({ error: "Invalid date format" });
      }
  
      // อัปเดตข้อมูลใบเสนอราคา
      const updatedQuotation = await prisma.quotation.update({
        where: { quotation_id: Number(id) },
        data: {
          cus_name,
          tax_id,
          address,
          date: formattedDate,
          credit_term,
          contract_name,
          sale_name,
          project_name,
          no_item,
          description,
          quantity,
          price,
          discount,
          amount,
          subtotal,
          special_discount,
          after_discount,
          vat,
          total,
        },
      });
  
      res.status(200).json({
        message: "Quotation updated successfully",
        data: updatedQuotation,
      });
  
    } catch (err) {
      console.error("Error updating Quotation:", err);
      res.status(500).json({ error: "Failed to update Quotation", details: err.message });
    }
  };
  
  exports.remove = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: "Quotation ID is required for deletion" });
      }
  
      // ตรวจสอบว่ามีใบเสนอราคานี้อยู่หรือไม่
      const existingQuotation = await prisma.quotation.findUnique({
        where: { quotation_id: Number(id) },
      });
  
      if (!existingQuotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
  
      // ลบใบเสนอราคา
      const deleted = await prisma.quotation.delete({
        where: { quotation_id: Number(id) },
      });
  
      res.status(200).json({
        message: "Quotation deleted successfully",
        data: deleted,
      });
  
    } catch (err) {
      console.error("Error deleting Quotation:", err);
      res.status(500).json({ error: "Failed to delete Quotation", details: err.message });
    }
  };
  
