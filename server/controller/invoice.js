const prisma = require("../config/prisma");

// 🟢 ดึงรายการสินค้าในใบแจ้งหนี้
exports.list = async (req, res) => {
  try {
    const { invoice_id } = req.params;

    const items = await prisma.invoice_item.findMany({
      where: { invoice_id: Number(invoice_id) },
      include: { product: true }, // ดึงข้อมูลสินค้า
    });

    res.json(items);
  } catch (err) {
    console.error("Error retrieving invoice items:", err);
    res.status(500).json({ error: "Failed to retrieve invoice items" });
  }
};

exports.create = async (req, res) => {
  try {
    const { customer_id, items } = req.body;
    const vat_rate = 7.0; // กำหนด VAT เป็น 7%

    // ตรวจสอบว่าลูกค้ามีอยู่จริง
    const customer = await prisma.customer.findUnique({
      where: { customer_id },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // สร้างใบแจ้งหนี้ใหม่
    const newInvoice = await prisma.invoice.create({
      data: {
        customer_id,
        vat_rate,
        subtotal: 0,
        vat: 0,
        discount: 0,
        total: 0,
      },
    });

    let invoice_id = newInvoice.invoice_id;
    let totalAddedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const { product_id, quantity, discount = 0 } = item;

      // ดึงข้อมูลสินค้า
      const product = await prisma.product.findUnique({
        where: { product_id },
      });

      if (!product) {
        return res.status(404).json({ error: `Product ID ${product_id} not found` });
      }

      const totalPrice = product.price * quantity - discount;
      subtotal += totalPrice;

      // เพิ่มสินค้าเข้าใบแจ้งหนี้
      const invoiceItem = await prisma.invoice_item.create({
        data: {
          invoice_id,
          product_id,
          quantity,
          discount,
          total: totalPrice,
        },
      });

      totalAddedItems.push(invoiceItem);
    }

    // คำนวณ VAT และยอดรวม
    const vat = (subtotal * vat_rate) / 100;
    const grandTotal = subtotal + vat;

    // อัปเดตใบแจ้งหนี้
    const updatedInvoice = await prisma.invoice.update({
      where: { invoice_id },
      data: { subtotal, vat, total: grandTotal },
    });

    res.json({
      message: "Invoice created and items added successfully",
      invoice: updatedInvoice,
      items: totalAddedItems,
    });
  } catch (err) {
    console.error("Error creating invoice:", err);
    res.status(500).json({ error: "Failed to create invoice" });
  }
};

exports.update = async (req, res) => {
  try {
    const { item_id, quantity, discount } = req.body;

    // ตรวจสอบว่ามี invoice item นี้หรือไม่
    const existingItem = await prisma.invoice_item.findUnique({
      where: { item_id },
    });

    if (!existingItem) {
      return res.status(404).json({ error: "Invoice item not found" });
    }

    // ดึงข้อมูลสินค้าเพื่อคำนวณราคาใหม่
    const product = await prisma.product.findUnique({
      where: { product_id: existingItem.product_id },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // คำนวณราคาสินค้าใหม่
    const totalPrice = product.price * quantity - discount;

    // อัปเดตข้อมูล invoice item
    await prisma.invoice_item.update({
      where: { item_id },
      data: { quantity, discount, total: totalPrice },
    });

    // คำนวณยอดรวมใบแจ้งหนี้ใหม่
    const invoiceItems = await prisma.invoice_item.findMany({
      where: { invoice_id: existingItem.invoice_id },
    });

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const vat = (subtotal * 7) / 100;
    const grandTotal = subtotal + vat;

    // อัปเดตใบแจ้งหนี้
    await prisma.invoice.update({
      where: { invoice_id: existingItem.invoice_id },
      data: { subtotal, vat, total: grandTotal },
    });

    res.json({ message: "Invoice item updated successfully" });
  } catch (err) {
    console.error("Error updating invoice item:", err);
    res.status(500).json({ error: "Failed to update invoice item" });
  }
};


// 🟢 ลบสินค้าออกจากใบแจ้งหนี้
exports.removeitem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid or missing item_id" });
    }

    // หา Invoice Item ก่อนลบ
    const existingItem = await prisma.invoice_item.findUnique({
      where: { item_id: id },
    });

    if (!existingItem) {
      return res.status(404).json({ error: "Invoice item not found" });
    }

    // ลบ Invoice Item
    await prisma.invoice_item.delete({
      where: { item_id: id },
    });

    // คำนวณยอดรวมใบแจ้งหนี้ใหม่
    const invoiceItems = await prisma.invoice_item.findMany({
      where: { invoice_id: existingItem.invoice_id },
    });

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const vat = (subtotal * 7) / 100;
    const grandTotal = subtotal + vat;

    // อัปเดตใบแจ้งหนี้หลังจากลบรายการสินค้า
    await prisma.invoice.update({
      where: { invoice_id: existingItem.invoice_id },
      data: { subtotal, vat, total: grandTotal },
    });

    res.json({ message: "Invoice item deleted successfully" });
  } catch (err) {
    console.error("Error deleting invoice item:", err);
    res.status(500).json({ error: "Failed to delete invoice item" });
  }
};

exports.removeInvoice = async (req, res) => {
  try {
    const invoice_id = parseInt(req.params.invoice_id, 10);

    if (!invoice_id || isNaN(invoice_id)) {
      return res.status(400).json({ error: "Invalid or missing invoice_id" });
    }

    // ตรวจสอบว่าใบแจ้งหนี้มีอยู่หรือไม่
    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoice_id },
    });

    if (!existingInvoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    await prisma.invoice.delete({
      where: { invoice_id },
    });

    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    console.error("Error deleting invoice:", err);
    res.status(500).json({ error: "Failed to delete invoice" });
  }
};

