import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ClipboardList, Clock, CheckCircle } from "lucide-react";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('all');
  const employeeList = ['all', ...new Set(todos.map(todo => todo.employee_id))].sort((a, b) => a - b);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('all'); // เพิ่ม state สำหรับการกรอง
  const [newTask, setNewTask] = useState({
    project_name: "",
    name: "",
    desc: "",
    employee_id:"",
  });
  const [editingTask, setEditingTask] = useState(null);

  

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/todo");
      const data = await response.json();
      setTodos(data.listTodo);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // สร้างรายการ Project ที่ไม่ซ้ำกัน
  const projectList = ['all', ...new Set(todos.map(todo => todo.project_name))];

  // กรองข้อมูลตาม Project ที่เลือก
  const filteredTodos = todos
  .filter(todo => selectedProject === 'all' || todo.project_name === selectedProject)
  .filter(todo => selectedEmployeeId === 'all' || todo.employee_id === parseInt(selectedEmployeeId));

    const updateTaskStatus = async (todo_id, newStatus) => {
      try {
        const taskToUpdate = todos.find((todo) => todo.todo_id === todo_id);
        if (!taskToUpdate) {
          alert("Task not found");
          return;
        }
    
        const payload = {
          project_name: taskToUpdate.project_name,
          employee_id: taskToUpdate.employee_id, // ใช้ employee_id จาก task ที่กำลังอัพเดท
          todo: [
            {
              todo_id: taskToUpdate.todo_id,
              status: newStatus,
              name: taskToUpdate.name,
              desc: taskToUpdate.desc,
            },
          ],
        };
    
        await fetch(`http://localhost:8080/api/todo`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
    
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.todo_id === todo_id ? { ...todo, status: newStatus } : todo
          )
        );
      } catch (err) {
        console.error("Error updating task status:", err);
        alert("Failed to update task status");
      }
    };

    // เพิ่ม function สำหรับตรวจสอบ employee
    const checkEmployeeExists = async (employeeId) => {
      try {
        const response = await fetch(`http://localhost:8080/api/employee`);
        if (!response.ok) {
          throw new Error('ไม่สามารถตรวจสอบข้อมูลพนักงานได้');
        }
        const data = await response.json();
        
        // ตรวจสอบว่ามี employee ที่มี id ตรงกับที่ระบุหรือไม่
        const employeeExists = data.listemployee.some(
          employee => employee.id === employeeId
        );
    
        if (!employeeExists) {
          throw new Error('ไม่พบรหัสพนักงานนี้ในระบบ');
        }
    
        return true;
      } catch (err) {
        console.error("Error checking employee:", err);
        throw err; // ส่ง error ไปให้ handleAddTask จัดการ
      }
    };

  const handleAddTask = async () => {
    try {
      // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
      if (!newTask.project_name || !newTask.name || !newTask.employee_id) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      // แปลง employee_id เป็น number
      const employeeId = parseInt(newTask.employee_id);
      if (isNaN(employeeId)) {
        alert("Employee ID ต้องเป็นตัวเลขเท่านั้น");
        return;
      }

      await checkEmployeeExists(employeeId);

      // ถ้าผ่านการตรวจสอบทั้งหมด จึงทำการสร้าง task
      const response = await fetch("http://localhost:8080/api/todo", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_name: newTask.project_name,
          employee_id: employeeId,
          todo: [
            {
              name: newTask.name,
              desc: newTask.desc || '',
            },
          ],
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      await fetchTodos();
      setIsModalOpen(false);
      setNewTask({
        project_name: "",
        name: "",
        desc: "",
        employee_id: "",
      });

      // แสดงข้อความสำเร็จ
      alert("สร้าง Task สำเร็จ");
    } catch (err) {
      console.error("Error adding task:", err);
      alert("เกิดข้อผิดพลาดในการสร้าง Task: " + err.message);
    }
  };

  const handleEditTask = async () => {
    try {
      const payload = {
        project_name: editingTask.project_name,
        employee_id: parseInt(editingTask.employee_id),
        todo: [
          {
            todo_id: editingTask.todo_id,
            name: editingTask.name,
            desc: editingTask.desc,
          },
        ],
      };

      await fetch("http://localhost:8080/api/todo", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.todo_id === editingTask.todo_id ? editingTask : todo
        )
      );

      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Error editing task:", err);
      alert("Failed to edit task: " + err.message);
    }
  };

  const handleDeleteTask = async (todo_id) => {
    try {
      await fetch(`http://localhost:8080/api/todo/${todo_id}`, {
        method: 'DELETE'
      });
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.todo_id !== todo_id)
      );
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task: " + err.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    </div>
  );

  const tasksToDo = filteredTodos.filter((todo) => todo.status === "mustdo");
  const tasksInProgress = filteredTodos.filter((todo) => todo.status === "inprogress");
  const tasksDone = filteredTodos.filter((todo) => todo.status === "finish");

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-6 bg-gray-50 ">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">ทั้งหมด</option>
              {projectList.filter(project => project !== 'all').map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>

            <select
            value={selectedEmployeeId}
            onChange={(e)=> setSelectedEmployeeId(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focusLring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value={"all"}>พนักงานทั้งหมด</option>
              {employeeList.filter(id=>id!== 'all')
              .map((employeeId) =>(
                <option key={employeeId} value={employeeId}>
                  พนักงาน ID:{employeeId}
                </option>
              ))}
            </select>
            <div className="text-sm text-gray-600">
              Task ทั้งหมด : {filteredTodos.length}
            </div>
          </div>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2 shadow-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <ClipboardList size={20} />
            สร้าง Task
          </button>
        </div>

        {isModalOpen && (
          <TaskModal
            title="เพิ่ม Task"
            task={newTask}
            setTask={setNewTask}
            onSave={handleAddTask}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {isEditModalOpen && (
          <TaskModal
            title="แก้ไข Task"
            task={editingTask}
            setTask={setEditingTask}
            onSave={handleEditTask}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TaskColumn
            title="งานที่ต้องทำ"
            icon={<ClipboardList className="text-yellow-500" size={24} />}
            tasks={tasksToDo}
            bgColor="bg-yellow-50"
            borderColor="border-yellow-200"
            onDrop={(todo_id) => updateTaskStatus(todo_id, "mustdo")}
            onEdit={(task) => {
              setEditingTask(task);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDeleteTask}
          />
          <TaskColumn
            title="งานที่กำลังทำ"
            icon={<Clock className="text-blue-500" size={24} />}
            tasks={tasksInProgress}
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
            onDrop={(todo_id) => updateTaskStatus(todo_id, "inprogress")}
            onEdit={(task) => {
              setEditingTask(task);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDeleteTask}
          />
          <TaskColumn
            title="งานเสร็จแล้ว"
            icon={<CheckCircle className="text-green-500" size={24} />}
            tasks={tasksDone}
            bgColor="bg-green-50"
            borderColor="border-green-200"
            onDrop={(todo_id) => updateTaskStatus(todo_id, "finish")}
            onEdit={(task) => {
              setEditingTask(task);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDeleteTask}
          />
        </div>
      </div>
    </DndProvider>
  );
};

// TaskColumn component remains the same
const TaskColumn = ({ title, icon, tasks, bgColor, borderColor, onDrop, onEdit, onDelete }) => {
  const [, drop] = useDrop({
    accept: "task",
    drop: (item) => onDrop && onDrop(item.todo_id),
  });

  return (
    <div
      ref={drop}
      className={`${bgColor} border ${borderColor} rounded-xl shadow-lg overflow-hidden`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 justify-center">
          {icon}
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="mt-2 text-center text-sm text-gray-600">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>
      <div className="p-4 max-h-[370px] overflow-y-auto">
        {tasks.map((task) => (
          <Task
            key={task.todo_id}
            task={task}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.todo_id)}
          />
        ))}
      </div>
    </div>
  );
};

// Task component remains the same
const Task = ({ task, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { todo_id: task.todo_id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-lg shadow-md mb-4 transform transition-all duration-200 hover:scale-102 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="border-b pb-2 mb-2">
        <h3 className="font-semibold text-lg text-gray-800">{task.project_name}</h3>
      </div>
      <div className="space-y-2">
        <p className="text-gray-700">
          <span className="font-medium">ชื่องาน:</span> {task.name}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">รายละเอียด:</span> {task.desc}
        </p>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-200"
          onClick={onEdit}
        >
          แก้ไข
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
          onClick={() => {
            if (window.confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
              onDelete();
            }
          }}
        >
          ลบ
        </button>
      </div>
    </div>
  );
};

// TaskModal component remains the same
const TaskModal = ({ title, task, setTask, onSave, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-2 text-gray-700">ชื่อโปรเจกต์</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={task.project_name || ''}
            onChange={(e) => setTask({ ...task, project_name: e.target.value })}
            placeholder="กรอกชื่อโปรเจกต์"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">ชื่อ Task</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={task.name || ''}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
            placeholder="กรอกชื่อ Task"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">รายละเอียด</label>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            value={task.desc || ''}
            onChange={(e) => setTask({ ...task, desc: e.target.value })}
            placeholder="กรอกรายละเอียดของ Task"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Employee ID</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={task.employee_id || ''}
            onChange={(e) => setTask({ ...task, employee_id: parseInt(e.target.value) || '' })}
            placeholder="กรอก Employee ID"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-200 text-gray-800"
          onClick={onClose}
        >
          ยกเลิก
        </button>
        <button
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-200 text-white"
          onClick={onSave}
        >
          บันทึก
        </button>
      </div>
    </div>
  </div>
);

export default Todo;