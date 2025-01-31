const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listInvoice = await prisma.invoice.findMany();
    res.json({ listInvoice });
  } catch (err) {
    console.error("Error retrieving Invoice records:", err);
    res.status(500).json({ error: "Failed to retrieve Invoice records" });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      cus_name,
      address,
      tax_id,
      date,
      total_amount,
      customer_receipt,
      payment_term,
      items,
    } = req.body;

    const newInvoice = await prisma.invoice.create({
      data: {
        cus_name,
        address,
        tax_id,
        date: new Date(date),
        total_amount,
        customer_receipt,
        payment_term,
        items: {
          create: items,
        },
      },
      include: { items: true },
    });

    res.status(200).json({
      message: "Invoice created successfully",
      data: newInvoice,
    });
  } catch (err) {
    console.error("Error creating Invoice:", err);
    res.status(500).json({ error: "Failed to create Invoice" });
  }
};

exports.update = async (req, res) => {
  try {
    const { invoice_id, cus_name, address, tax_id, date, total_amount, customer_receipt, payment_term, items } = req.body;

    const updatedInvoice = await prisma.invoice.update({
      where: { invoice_id },
      data: {
        cus_name,
        address,
        tax_id,
        date: new Date(date),
        total_amount,
        customer_receipt,
        payment_term,
        items: {
          deleteMany: {},
          create: items,
        },
      },
      include: { items: true },
    });

    res.status(200).json({ message: "Invoice updated successfully", invoice: updatedInvoice });
  } catch (err) {
    console.error("Error updating Invoice:", err);
    res.status(500).json({ error: "Failed to update Invoice" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { invoice_id } = req.body;

    await prisma.item.deleteMany({ where: { invoice_id } });
    await prisma.invoice.delete({ where: { invoice_id } });

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (err) {
    console.error("Error deleting Invoice:", err);
    res.status(500).json({ error: "Failed to delete Invoice" });
  }
};
