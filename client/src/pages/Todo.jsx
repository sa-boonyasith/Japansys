import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Todo = () => {
  const [todo, setTodo] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ project_name: '', desc: '' });

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/todo');
      setTodo(res.data.listproject); // Assuming API returns { listproject: [...] }
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:8080/api/todo', newTask);
      fetchTodo(); // Refresh tasks after adding
      setModalOpen(false);
      setNewTask({ project_name: '', desc: '' });
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/todo/${id}`, { status: newStatus });
      fetchTodo(); // Refresh tasks after updating
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
    }
  };

  // Group todos by status
  const groupedTodos = {
    mustdo: todo.filter((item) => item.status === 'mustdo'),
    inprogress: todo.filter((item) => item.status === 'inprogress'),
    finish: todo.filter((item) => item.status === 'finish'),
  };

  // Render tasks in a specific category
  const renderTasks = (tasks, statusColor, actionButtons) => (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {tasks.map((task) => (
        <div
          key={task.project_id}
          className="p-4 border border-gray-300 rounded shadow-sm bg-white"
        >
          <h2 className="font-semibold text-lg mb-2">{task.project_name}</h2>
          <p className="text-sm text-gray-700 mb-2">{task.desc || 'No description'}</p>
          <span className={`px-2 py-1 rounded ${statusColor}`}>{task.status}</span>
          <div className="mt-2 flex space-x-2">{actionButtons(task)}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4">
      {/* Error message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Create Task Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          สร้าง Task
        </button>
      </div>

      {/* Modal for creating a task */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">เพิ่ม Task ใหม่</h2>
            <input
              type="text"
              placeholder="ชื่อ Task"
              value={newTask.project_name}
              onChange={(e) => setNewTask({ ...newTask, project_name: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <textarea
              placeholder="รายละเอียด"
              value={newTask.desc}
              onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {todo.length === 0 && !error && <div>Loading...</div>}

      {/* Task Columns */}
      {todo.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* งานที่ต้องทำ */}
          <div>
            <h2 className="text-xl font-bold mb-4">งานที่ต้องทำ</h2>
            {renderTasks(
              groupedTodos.mustdo,
              'bg-red-500 text-white',
              (task) => (
                <button
                  onClick={() => handleUpdateStatus(task.project_id, 'inprogress')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  เริ่มทำ
                </button>
              )
            )}
          </div>

          {/* งานที่กำลังทำ */}
          <div>
            <h2 className="text-xl font-bold mb-4">งานที่กำลังทำ</h2>
            {renderTasks(
              groupedTodos.inprogress,
              'bg-yellow-500 text-white',
              (task) => (
                <button
                  onClick={() => handleUpdateStatus(task.project_id, 'finish')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  เสร็จ
                </button>
              )
            )}
          </div>

          {/* งานที่เสร็จแล้ว */}
          <div>
            <h2 className="text-xl font-bold mb-4">งานที่เสร็จแล้ว</h2>
            {renderTasks(
              groupedTodos.finish,
              'bg-green-500 text-white',
              (task) => (
                <button
                  onClick={() => alert(`Review task: ${task.project_id}`)}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  ตรวจแล้ว
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
