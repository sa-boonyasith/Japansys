import React, { useState } from "react";

const initialTasks = {
  todo: [
    { id: 1, title: "งานที่ต้องทำ 1", details: "รายละเอียดงานที่ต้องทำ" },
    { id: 2, title: "งานที่ต้องทำ 2", details: "รายละเอียดงานที่ต้องทำ" },
  ],
  inProgress: [],
  done: [],
};

const todo = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({ title: "", details: "" });
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling Modal

  const moveTask = (id, from, to) => {
    const task = tasks[from].find((task) => task.id === id);
    setTasks({
      ...tasks,
      [from]: tasks[from].filter((task) => task.id !== id),
      [to]: [...tasks[to], task],
    });
  };

  const addTask = () => {
    if (newTask.title.trim() === "") {
      alert("กรุณากรอกชื่อโปรเจค");
      return;
    }

    const newTaskId = Date.now(); // Unique ID for the new task
    setTasks({
      ...tasks,
      todo: [
        ...tasks.todo,
        { id: newTaskId, title: newTask.title, details: newTask.details },
      ],
    });
    setNewTask({ title: "", details: "" }); // Reset form fields
    setIsModalOpen(false); // Close Modal after adding task
  };

  return (
    <div className="p-4">
      {/* Button to Open Modal */}
      <div className="mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          สร้าง Task
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">สร้าง Task ใหม่</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="ชื่อโปรเจค"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="border border-gray-300 p-2 rounded"
              />
              <textarea
                placeholder="รายละเอียดงาน"
                value={newTask.details}
                onChange={(e) =>
                  setNewTask({ ...newTask, details: e.target.value })
                }
                className="border border-gray-300 p-2 rounded"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={addTask}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  เพิ่ม Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-3 gap-4">
        {/* To Do Column */}
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">งานที่ต้องทำ</h2>
          {tasks.todo.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 mb-2 rounded shadow border"
            >
              <h3 className="font-bold">{task.title}</h3>
              <p className="text-sm">{task.details}</p>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  onClick={() => moveTask(task.id, "todo", "inProgress")}
                >
                  เริ่มทำ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* In Progress Column */}
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">งานที่กำลังทำ</h2>
          {tasks.inProgress.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 mb-2 rounded shadow border"
            >
              <h3 className="font-bold">{task.title}</h3>
              <p className="text-sm">{task.details}</p>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
                  onClick={() => moveTask(task.id, "inProgress", "done")}
                >
                  เสร็จ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Done Column */}
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">งานที่เสร็จ</h2>
          {tasks.done.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 mb-2 rounded shadow border"
            >
              <h3 className="font-bold">{task.title}</h3>
              <p className="text-sm">{task.details}</p>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
                  onClick={() => moveTask(task.id, "done", "todo")}
                >
                  แก้ไข
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default todo;
