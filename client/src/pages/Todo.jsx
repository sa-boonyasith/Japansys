import React, { useEffect, useState } from "react";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(1);
  const [newTask, setNewTask] = useState({
    project_name: "",
    name: "",
    desc: "",
  });
  const [editingTask, setEditingTask] = useState(null);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/todo");
      setTodos(response.data.listTodo);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  const updateTaskStatus = async (todo_id, newStatus) => {
    try {
      const taskToUpdate = todos.find((todo) => todo.todo_id === todo_id);
      if (!taskToUpdate) {
        alert("Task not found");
        return;
      }

      const payload = {
        project_name: taskToUpdate.project_name,
        employee_id: employeeId,
        todo: [
          {
            todo_id: taskToUpdate.todo_id,
            status: newStatus,
            name: taskToUpdate.name,
            desc: taskToUpdate.desc,
          },
        ],
      };

      await axios.put(`http://localhost:8080/api/todo`, payload);

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

  const handleAddTask = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/todo", {
        project_name: newTask.project_name,
        employee_id: employeeId,
        todo: [
          {
            name: newTask.name,
            desc: newTask.desc,
          },
        ],
      });
  
      setTodos((prevTodos) => [...prevTodos, ...response.data.tasks]);
      setIsModalOpen(false);
      setNewTask({
        project_name: "",
        name: "",
        desc: "",
      });
    } catch (err) {
      console.error("Error adding task:", err);
      alert(
        "Failed to create task: " + (err.response?.data?.message || err.message)
      );
    }
  };
  

  const handleEditTask = async () => {
    try {
      const payload = {
        project_name: editingTask.project_name,  // ชื่อโปรเจกต์ใหม่
        employee_id: employeeId,
        todo: [
          {
            todo_id: editingTask.todo_id,
            name: editingTask.name,
            desc: editingTask.desc,
          },
        ],
      };
  
      await axios.put("http://localhost:8080/api/todo", payload);  // ตรวจสอบ URL API ให้ถูกต้อง
  
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.todo_id === editingTask.todo_id ? editingTask : todo
        )
      );
  
      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Error editing task:", err);
      alert(
        "Failed to edit task: " + (err.response?.data?.message || err.message)
      );
    }
  };
  

  const handleDeleteTask = async (todo_id) => {
    try {
      await axios.delete(`http://localhost:8080/api/todo/${todo_id}`);
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.todo_id !== todo_id)
      );
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task: " + err.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const tasksToDo = todos.filter((todo) => todo.status === "mustdo");
  const tasksInProgress = todos.filter((todo) => todo.status === "inprogress");
  const tasksDone = todos.filter((todo) => todo.status === "finish");

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-2 ">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-6"
          onClick={() => setIsModalOpen(true)}
        >
          สร้าง Task
        </button>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <TaskColumn
            title="งานที่ต้องทำ"
            tasks={tasksToDo}
            onDrop={(todo_id) => updateTaskStatus(todo_id, "mustdo")}
            onEdit={(task) => {
              setEditingTask(task);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDeleteTask}
          />
          <TaskColumn
            title="งานที่กำลังทำ"
            tasks={tasksInProgress}
            onDrop={(todo_id) => updateTaskStatus(todo_id, "inprogress")}
            onEdit={(task) => {
              setEditingTask(task);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDeleteTask}
          />
          <TaskColumn
            title="งานเสร็จแล้ว"
            tasks={tasksDone}
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

const TaskColumn = ({ title, tasks, onDrop, onEdit, onDelete }) => {
  const [, drop] = useDrop({
    accept: "task",
    drop: (item) => onDrop && onDrop(item.todo_id),
  });

  return (
    <div ref={drop} className="bg-gray-100 p-4 rounded-lg shadow-md max-h-[430px] overflow-y-auto">
      <h2 className="text-xl font-semibold text-center mb-4 ">{title}</h2>
      {tasks.map((task) => (
        <Task
          key={task.todo_id}
          task={task}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.todo_id)}
        />
      ))}
    </div>
  );
};

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
      className={`bg-white p-4 rounded-lg shadow-md mb-4 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <p>
        <strong>ชื่อโปรเจกต์:</strong> {task.project_name}
      </p>
      <p>
        <strong>ชื่อ:</strong> {task.name}
      </p>
      <p>
        <strong>รายละเอียด:</strong> {task.desc}
      </p>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          onClick={onEdit}
        >
          แก้ไข
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={onDelete}
        >
          ลบ
        </button>
      </div>
    </div>
  );
};

const TaskModal = ({ title, task, setTask, onSave, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      
      {/* Project Name Input */}
      <div className="mb-4">
        <label className="block font-medium mb-2">ชื่อโปรเจกต์</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg"
          value={task.project_name || ''}
          onChange={(e) => setTask({ ...task, project_name: e.target.value })}
          placeholder="กรอกชื่อโปรเจกต์"
        />
      </div>

      {/* Task Name Input */}
      <div className="mb-4">
        <label className="block font-medium mb-2">ชื่อ Task</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg"
          value={task.name || ''}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          placeholder="กรอกชื่อ Task"
        />
      </div>

      {/* Task Description Input */}
      <div className="mb-4">
        <label className="block font-medium mb-2">รายละเอียด</label>
        <textarea
          className="w-full px-4 py-2 border rounded-lg"
          rows="4"
          value={task.desc || ''}
          onChange={(e) => setTask({ ...task, desc: e.target.value })}
          placeholder="กรอกรายละเอียดของ Task"
        ></textarea>
      </div>

      {/* Employee ID Input */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Employee ID</label>
        <input
          type="number"
          className="w-full px-4 py-2 border rounded-lg"
          value={task.employee_id || ''}
          onChange={(e) => setTask({ ...task, employee_id: parseInt(e.target.value) || '' })}
          placeholder="กรอก Employee ID"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={onClose}
        >
          ยกเลิก
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={onSave}
        >
          บันทึก
        </button>
      </div>
    </div>
  </div>
);


export default Todo;
