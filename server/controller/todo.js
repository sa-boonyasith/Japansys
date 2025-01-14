const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listproject = await prisma.todo.findMany();
    res.json({ listproject });
  } catch (err) {
    console.log(err);
  }
};
exports.create = async (req, res) => {
  try {
    // รับค่า employee_id จาก request body (หรือจาก user authentication)
    const { project_name, desc, employee_id , todo } = req.body;

    // ตรวจสอบว่ามีการส่งค่า employee_id มาหรือไม่
    if (!employee_id || isNaN(employee_id)) {
      return res.status(400).json({ error: "Invalid or missing employee ID" });
    }

    // สร้าง Todo ใหม่พร้อมเชื่อมโยงกับ employee_id
    const newproject = await prisma.todo.create({
      data: {
        project_name,
        todo,
        desc,
        employee_id: Number(employee_id), // แปลงให้เป็นตัวเลข
      },
    });

    // ตอบกลับเมื่อสร้างสำเร็จ
    res.status(201).json({
      message: "Project created successfully",
      newproject,
    });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Failed to create project" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params; // รับ project_id จาก URL
    const { project_name, desc, status, employee_id,todo } = req.body; // รับข้อมูลจาก body

    // ตรวจสอบว่ามี project_id อยู่ในฐานข้อมูลหรือไม่
    const existingTodo = await prisma.todo.findUnique({
      where: {
        project_id: Number(id),
      },
    });

    if (!existingTodo) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Prepare the data for update
    const updateData = {
      project_name: project_name || undefined,
      todo : todo ||undefined,
      desc: desc || undefined,
      status: status || undefined,
    };

    // If employee_id is provided, update the relation
    if (employee_id) {
      updateData.employee = {
        connect: { id: Number(employee_id) }, // Connect to the new employee
      };
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedProject = await prisma.todo.update({
      where: {
        project_id: Number(id),
      },
      data: updateData,
    });

    res.status(200).json({
      message: "Project updated successfully",
      updatedProject,
    });
  } catch (err) {
    console.error("Error updating project:", err);

    // ตรวจสอบข้อผิดพลาด Prisma
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(500).json({ error: "Failed to update project" });
  }
};


exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.todo.delete({
      where: {
        project_id: Number(id),
      },
    });
    res.json({ message: "Deleted succesfully", deleted });
  } catch (err) {
    console.error("Error deleting project".err.message);
  }
};
