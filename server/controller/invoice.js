const prisma = require("../config/prisma");
const thaiBaht = require("thai-baht-text");

exports.list = async (req, res) => {
  try {
    const listInvoice = await prisma.invoice.findMany({
      include: {
        invoice_items: true,
      },
    });
    res.json({ listInvoice });
  } catch (err) {
    console.error("Error retrieving Receipt records:", err);
    res.status(500).json({ error: "Failed to retrieve Receipt records" });
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
        .json({ error: "Receipt must contain at least one item" });
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
      const total_after_discount = Math.max(
        total_before_discount - discount,
        0
      ); // ป้องกันค่าติดลบ

      // ปัดเศษทศนิยม 2 ตำแหน่ง
      const final_total = parseFloat(total_after_discount.toFixed(2));

      // เพิ่มราคารวมของรายการนี้เข้าไปใน subtotal
      subtotal += final_total;

      // เพิ่มสินค้าไปยังรายการใบเสนอราคา
      processedItems.push({
        product_id,
        quantity,
        unit_price: parseFloat(unit_price.toFixed(2)),
        total: final_total,
        discount: parseFloat(discount.toFixed(2)),
      });
    }

    const total_discount_rate = parseFloat(
      (subtotal * (discount_rate / 100)).toFixed(2)
    );
    const total_after_discount = parseFloat(
      (subtotal - total_discount_rate).toFixed(2)
    );

    // คำนวณ VAT และราคารวมสุดท้าย
    const vat_amount = parseFloat(
      ((total_after_discount * vat) / 100).toFixed(2)
    );
    const total_all = parseFloat(
      (total_after_discount + vat_amount).toFixed(2)
    );
    const total_inthai = thaiBaht(total_all);

    // บันทึกใบเสนอราคา
    const newReceipt = await prisma.invoice.create({
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
        invoice_items: {
          create: processedItems,
        },
      },
      include: {
        invoice_items: true,
        customer: true,
      },
    });

    res.status(201).json({
      message: "Receipt created successfully",
      data: newReceipt,
    });
  } catch (err) {
    console.error("Error creating Receipt:", err);
    res.status(500).json({ error: "Failed to create Receipt" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_id,
      date,
      expire_date,
      credit_term,
      discount_rate,
      items,
      status,
    } = req.body;
    const vat = 7; // VAT 7%

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(402).json({ error: "Invalid Invoice ID" });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Invoice must contain at least one item" });
    }

    const validStatuses = ["pending", "approved", "rejected"];
    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({
          error: "Invalid status. Allowed values: pending, approved, rejected",
        });
    }

    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoice_id: parsedId },
      include: { invoice_items: true },
    });

    if (!existingInvoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const customer = await prisma.customer.findUnique({
      where: { customer_id },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const startDate = new Date(date);
    const endDate = new Date(expire_date);
    const confirm_price = Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    );

    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const { product_id, quantity, discount = 0 } = item;

      const parsedProductId = parseInt(product_id, 10);
      if (isNaN(parsedProductId)) {
        return res
          .status(400)
          .json({ error: `Invalid product ID: ${product_id}` });
      }

      const product = await prisma.product.findUnique({
        where: { product_id: parsedProductId }, // ✅ Fixed syntax
      });

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product with ID ${product_id} not found` });
      }

      const unit_price = product.price;
      const total_before_discount = unit_price * quantity;
      const total_after_discount = Math.max(
        total_before_discount - discount,
        0
      );

      subtotal += total_after_discount;

      processedItems.push({
        product_id: parsedProductId,
        quantity,
        unit_price: parseFloat(unit_price.toFixed(2)),
        total: parseFloat(total_after_discount.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
      });
    }
    const parsedDiscountRate = Number(discount_rate) || 0;

    const total_discount_rate = subtotal * (discount_rate / 100);
    const total_after_discount = subtotal - total_discount_rate;
    const vat_amount = (total_after_discount * vat) / 100;
    const total_all = total_after_discount + vat_amount;
    const total_inthai = thaiBaht(parseFloat(total_all.toFixed(2)));
    

    await prisma.invoice_item.deleteMany({
      where: { invoice_id: parsedId },
    });

    

    const updatedInvoice = await prisma.invoice.update({
      where: { invoice_id: parsedId },
      data: {
        customer_id,
        date: startDate,
        expire_date: endDate,
        confirm_price,
        discount_rate: parseFloat(parsedDiscountRate.toFixed(2)),
        subtotal: parseFloat(subtotal.toFixed(2)),
        total_after_discount: parseFloat(total_after_discount.toFixed(2)),
        vat,
        vat_amount: parseFloat(vat_amount.toFixed(2)),
        total_all: parseFloat(total_all.toFixed(2)),
        total_inthai,
        credit_term,
        status,
      },
      include: { invoice_items: true, customer: true },
    });

    await prisma.invoice_item.createMany({
      data: processedItems.map((item) => ({
        ...item,
        invoice_id: parsedId,
      })),
    });

    res.status(200).json({
      message: "Invoice updated successfully",
      data: updatedInvoice,
    });
  } catch (err) {
    console.error("Error updating Invoice:", err);
    res.status(500).json({ error: "Failed to update Invoice" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Invoice ID is required for deletion" });
    }

    // ตรวจสอบว่ามีใบเสนอราคานี้อยู่หรือไม่
    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoice_id: Number(id) },
    });

    if (!existingInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // ลบใบเสนอราคา
    const deleted = await prisma.invoice.delete({
      where: { invoice_id: Number(id) },
    });

    res.status(200).json({
      message: "Invoice deleted successfully",
      data: deleted,
    });
  } catch (err) {
    console.error("Error deleting Invoice:", err);
    res
      .status(500)
      .json({ error: "Failed to delete Invoice", details: err.message });
  }
};
