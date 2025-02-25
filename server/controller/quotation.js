const prisma = require("../config/prisma");
const thaiBaht = require("thai-baht-text");

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
      date,
      expire_date,
      credit_term,
      discount_rate,
      items,
    } = req.body;
    const vat = 7; // VAT 7%

    // ตรวจสอบว่ามีรายการสินค้าหรือไม่
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Quotation must contain at least one item" });
    }

    // ค้นหาข้อมูลลูกค้า
    const customer = await prisma.customer.findUnique({
      where: { customer_id },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // คำนวณจำนวนวันระหว่าง `date` และ `expire_date`
    const startDate = new Date(date);
    const endDate = new Date(expire_date);
    const confirm_price = Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    );

    // ประมวลผลสินค้าทั้งหมด และคำนวณราคารวม
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const { product_id, quantity, discount = 0 } = item;

      // ค้นหาสินค้า
      const product = await prisma.product.findUnique({
        where: { product_id },
      });

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product with ID ${product_id} not found` });
      }

      // คำนวณราคาสินค้าแต่ละรายการ
      const unit_price = product.price;
      const total_before_discount = unit_price * quantity;
      const total_after_discount = Math.max(total_before_discount - discount, 0); // ป้องกันค่าติดลบ

      // เพิ่มราคารวมของรายการนี้เข้าไปใน subtotal
      subtotal += total_after_discount;
      

      // เพิ่มสินค้าไปยังรายการใบเสนอราคา
      processedItems.push({
        product_id,
        quantity,
        unit_price,
        total: total_after_discount,
        discount,
      });
    }

    const total_discount_rate = subtotal * (discount_rate / 100);
    const total_after_discount = subtotal - total_discount_rate;
    // คำนวณ VAT และราคารวมสุดท้าย
    const vat_amount = (total_after_discount * vat) / 100;
    const total_all = total_after_discount + vat_amount;
    const total_inthai = thaiBaht(total_all);

    // บันทึกใบเสนอราคา
    const newQuotation = await prisma.quotation.create({
      data: {
        customer_id,
        date: startDate,
        expire_date: endDate,
        confirm_price,
        discount_rate,
        subtotal,
        total_after_discount,
        vat,
        vat_amount,
        total_all,
        total_inthai,
        credit_term,

        // บันทึกรายการสินค้า
        quotation_items: {
          create: processedItems,
        },
      },
      include: {
        quotation_items: true,
        customer: true,
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
      no_item, // แก้จาก No_item
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
    if (
      quantity < 0 ||
      price < 0 ||
      discount < 0 ||
      subtotal < 0 ||
      vat < 0 ||
      total < 0
    ) {
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
    res
      .status(500)
      .json({ error: "Failed to update Quotation", details: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Quotation ID is required for deletion" });
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
    res
      .status(500)
      .json({ error: "Failed to delete Quotation", details: err.message });
  }
};
