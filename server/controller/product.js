const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    console.error("Error retrieving products:", err);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};

exports.create = async (req, res) => {
    try {
      const { name, price } = req.body;
  
      // ตรวจสอบค่าที่รับมา
      if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "Invalid product name" });
      }
      if (!price || isNaN(price) || Number(price) <= 0) {
        return res.status(400).json({ error: "Price must be a positive number" });
      }
  
      // ตรวจสอบว่าสินค้าชื่อเดียวกันมีอยู่แล้วหรือไม่
      const existingProduct = await prisma.product.findUnique({
        where: { name },
      });
  
      if (existingProduct) {
        return res.status(409).json({ error: "Product name already exists" });
      }
  
      // สร้างสินค้าใหม่
      const product = await prisma.product.create({
        data: {
          name: name.trim(),
          price: Number(price),
        },
      });
  
      res.status(201).json(product);
    } catch (err) {
      console.error("Error creating product:", err);
  
      // จัดการข้อผิดพลาดจาก Prisma
      if (err.code === "P2002") {
        return res.status(409).json({ error: "Product name must be unique" });
      }
  
      res.status(500).json({ error: "Failed to create product" });
    }
  };

  exports.update = async (req, res) => {
    try {
      const { id } = req.params; // รับ ID จาก URL params
      const { name, price } = req.body;
  
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
  
      const productId = Number(id);
  
      // ค้นหาว่ามีสินค้านี้อยู่หรือไม่
      const existingProduct = await prisma.product.findUnique({
        where: { product_id: productId },
      });
  
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // อัปเดตสินค้าเฉพาะฟิลด์ที่มีการส่งมา
      const updatedProduct = await prisma.product.update({
        where: { product_id: productId },
        data: {
          name: name?.trim() || existingProduct.name,
          price: price !== undefined ? Number(price) : existingProduct.price,
        },
      });
  
      res.json(updatedProduct);
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ error: "Failed to update product" });
    }
  };
  
  exports.remove = async (req, res) => {
    try {
      const { id } = req.params; // ใช้ params เพื่อความเป็น RESTful API
  
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
  
      const productId = Number(id);
  
      // ตรวจสอบว่าสินค้ามีอยู่หรือไม่
      const existingProduct = await prisma.product.findUnique({
        where: { product_id: productId },
        include: { invoiceItems: true }, // เช็คว่าสินค้านี้ถูกใช้ใน invoice หรือไม่
      });
  
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // ถ้าสินค้ามีอยู่ในใบแจ้งหนี้ ห้ามลบ
      if (existingProduct.invoiceItems.length > 0) {
        return res.status(400).json({ error: "Cannot delete product linked to invoices" });
      }
  
      // ลบสินค้า
      await prisma.product.delete({
        where: { product_id: productId },
      });
  
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).json({ error: "Failed to delete product" });
    }
  };