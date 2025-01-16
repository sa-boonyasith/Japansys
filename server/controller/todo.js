const prisma = require("../config/prisma");

exports.list = async (req, res) => {
  try {
    const listTodo = await prisma.todo.findMany({
      include: {
        project: {
          select: {
            project_name: true, // ดึงเฉพาะชื่อโปรเจค
          },
        },
      },
    });

    // จัดรูปแบบข้อมูลให้ project_name อยู่ในระดับเดียวกับ todo
    const formattedTodos = listTodo.map((todo) => ({
      ...todo,
      project_name: todo.project?.project_name || "ไม่มีข้อมูล", // เพิ่ม project_name
    }));

    res.json({ listTodo: formattedTodos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};


exports.listproject = async(req,res)=>{
  try{
    const listProject = await prisma.project.findMany()
    res.json({listProject})
  }catch(err){
    console.log(err)
  }
}

exports.create = async (req, res) => {
  try {
    // รับค่าจาก body
    const { project_name, employee_id, todo } = req.body;

    // ตรวจสอบว่ามี employee_id และ task ย่อยหรือไม่
    if (!employee_id || !Array.isArray(todo) || todo.length === 0) {
      return res.status(400).json({
        error: "Missing required fields: 'employee_id' and 'todo'",
      });
    }

    // ตรวจสอบว่า employee_id มีอยู่ในฐานข้อมูลหรือไม่
    const employee = await prisma.employee.findUnique({
      where: { id: Number(employee_id) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // ตรวจสอบว่ามีโปรเจกต์ที่ชื่อเดียวกันอยู่แล้วหรือไม่
    let project = await prisma.project.findUnique({
      where: { project_name },
    });

    if (!project) {
      // หากไม่มีโปรเจกต์ ให้สร้างโปรเจกต์ใหม่
      project = await prisma.project.create({
        data: {
          project_name,
          progress: 0, // ตั้งค่า progress เป็น 0 ก่อน
          employee_id: Number(employee_id),
        },
      });
    }

    // เพิ่ม tasks ในโปรเจกต์
    const createdTasks = await Promise.all(
      todo.map((task) =>
        prisma.todo.create({
          data: {
            name: task.name,
            desc: task.desc || "No description provided", // ค่า default
            status: task.status || "mustdo", // ค่า default
            project_id: project.project_id,
            employee_id: Number(employee_id),
          },
        })
      )
    );

    // คำนวณ progress และ progress_circle ใหม่
    const allTodos = await prisma.todo.findMany({
      where: { project_id: project.project_id },
    });

    const totalTasks = allTodos.length;
    const finishCount = allTodos.filter((task) => task.status === "finish")
      .length;
    const progressPercentage =
      totalTasks > 0 ? (finishCount / totalTasks) * 100 : 0;

    // อัปเดต progress และ progress_circle ในโปรเจกต์
    const updatedProject = await prisma.project.update({
      where: { project_id: project.project_id },
      data: {
        progress: totalTasks, // ใช้จำนวน tasks ทั้งหมด
        progress_circle: Math.round(progressPercentage), // คำนวณ progress_circle
      },
    });

    // ตอบกลับเมื่อสำเร็จ
    res.status(201).json({
      message: "Project and tasks created successfully",
      project: updatedProject,
      tasks: createdTasks,
    });
  } catch (err) {
    console.error("Error creating project and tasks:", err);
    res.status(500).json({ error: "Failed to create project and tasks" });
  }
};




exports.update = async (req, res) => {
  try {
    const { project_name, employee_id, todo = [] } = req.body;

    // Validate project_name
    if (!project_name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    let project = await prisma.project.findUnique({
      where: { project_name },
    });

    // If project doesn't exist, create it
    if (!project) {
      if (!employee_id) {
        return res.status(400).json({
          error: "Employee ID is required to create a new project",
        });
      }

      const employeeExists = await prisma.employee.findUnique({
        where: { id: Number(employee_id) },
      });

      if (!employeeExists) {
        return res.status(404).json({ error: "Employee not found" });
      }

      project = await prisma.project.create({
        data: {
          project_name,
          employee_id: Number(employee_id),
          progress: 0,
          progress_circle: 0,
        },
      });
    } else if (employee_id) {
      // Update the project with a new employee if provided
      const employeeExists = await prisma.employee.findUnique({
        where: { id: Number(employee_id) },
      });

      if (!employeeExists) {
        return res.status(404).json({ error: "Employee not found" });
      }

      project = await prisma.project.update({
        where: { project_name },
        data: { employee_id: Number(employee_id) },
      });
    }

    // Handle tasks (todos) - Update all tasks in the project
    let updatedTodos = [];
    if (Array.isArray(todo) && todo.length > 0) {
      updatedTodos = await Promise.all(
        todo.map(async (task) => {
          if (!task.todo_id) {
            // Create a new task if todo_id is not provided
            return prisma.todo.create({
              data: {
                name: task.name || "Untitled Task",
                desc: task.desc || "No description provided",
                status: task.status || "mustdo",
                project_id: project.project_id,
                employee_id: Number(employee_id),
              },
            });
          }

          // Validate and update existing task
          const existingTodo = await prisma.todo.findUnique({
            where: { todo_id: task.todo_id },
          });

          if (!existingTodo) {
            throw new Error(`Task with todo_id ${task.todo_id} not found`);
          }

          // Reassign the task to the new project if needed
          if (existingTodo.project_id !== project.project_id) {
            await prisma.todo.update({
              where: { todo_id: task.todo_id },
              data: {
                project_id: project.project_id, // Reassign to the new project
              },
            });
          }

          // Update the task details
          return prisma.todo.update({
            where: { todo_id: task.todo_id },
            data: {
              status: task.status || existingTodo.status,
              name: task.name || existingTodo.name,
              desc: task.desc || existingTodo.desc,
            },
          });
        })
      );
    }

    // Recalculate progress and progress_circle after tasks are added or updated
    const allTodos = await prisma.todo.findMany({
      where: { project_id: project.project_id },
    });

    const finishCount = allTodos.filter((task) => task.status === "finish").length;
    const totalTasks = allTodos.length;
    const progressPercentage = totalTasks > 0 ? (finishCount / totalTasks) * 100 : 0;

    // Update project progress
    const finalProject = await prisma.project.update({
      where: { project_name },
      data: {
        progress_circle: Math.round(progressPercentage),
        progress: totalTasks,
      },
    });

    // Delete projects without matching todos
    await prisma.project.deleteMany({
      where: {
        project_id: {
          notIn: await prisma.todo.findMany({
            select: { project_id: true },
            distinct: ['project_id'],
          }).then((todos) => todos.map((todo) => todo.project_id)),
        },
      },
    });

    // Response
    res.status(200).json({
      message: "Project and tasks updated successfully",
      updatedProject: finalProject, // Returning updated project
      updatedTodos, // Returning updated tasks
    });
  } catch (err) {
    console.error("Error updating project and tasks:", err);
    res.status(500).json({ error: err.message || "Failed to update project and tasks" });
  }
};


exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่ามี Task ที่ต้องการลบหรือไม่
    const task = await prisma.todo.findUnique({
      where: {
        todo_id: Number(id),
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // ลบ Task ที่ระบุ
    await prisma.todo.delete({
      where: {
        todo_id: Number(id),
      },
    });

    // ตรวจสอบ Task ที่เหลือในโปรเจกต์
    const remainingTasks = await prisma.todo.findMany({
      where: {
        project_id: task.project_id,
      },
    });

    let projectDeleted = null;

    if (remainingTasks.length === 0) {
      // หากไม่มี Task เหลือ ให้ลบโปรเจกต์
      projectDeleted = await prisma.project.delete({
        where: {
          project_id: task.project_id,
        },
      });
    } else {
      // คำนวณ `progress` และ `progress_circle` ใหม่
      const totalTasks = remainingTasks.length;
      const finishedTasks = remainingTasks.filter((t) => t.status === "finish").length;
      const progressCircle = Math.round((finishedTasks / totalTasks) * 100);

      // อัปเดตโปรเจกต์ด้วยค่าใหม่
      await prisma.project.update({
        where: {
          project_id: task.project_id,
        },
        data: {
          progress: totalTasks,
          progress_circle: progressCircle,
        },
      });
    }

    // ส่งคำตอบกลับ
    res.status(200).json({
      message: `Task deleted successfully${
        projectDeleted ? " and project deleted as well" : " and project updated"
      }`,
      deletedTaskId: task.todo_id,
      projectDeleted,
    });
  } catch (err) {
    console.error("Error deleting task and updating project:", err.message);
    res.status(500).json({ error: "Failed to delete task or update project" });
  }
};
