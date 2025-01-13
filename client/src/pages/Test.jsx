import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ITEM_TYPE = 'TASK';

const Task = ({ task, onDrop, statusColor }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: task.project_id, currentStatus: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 border border-gray-300 rounded shadow-sm bg-white ${isDragging ? 'opacity-50' : ''}`}
    >
      <h2 className="font-semibold text-lg mb-2">{task.project_name}</h2>
      <p className="text-sm text-gray-700 mb-2">{task.desc || 'No description'}</p>
      <span className={`px-2 py-1 rounded ${statusColor}`}>{task.status}</span>
    </div>
  );
};

const TaskColumn = ({ status, tasks, statusColor, onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item) => onDrop(item, status),
  }));

  return (
    <div ref={drop} className="space-y-4 p-4 bg-gray-100 rounded min-h-[300px]">
      <h2 className="text-xl font-bold mb-4">
        {status === 'mustdo' ? 'งานที่ต้องทำ' : status === 'inprogress' ? 'งานที่กำลังทำ' : 'งานที่เสร็จแล้ว'}
      </h2>
      {tasks.map((task) => (
        <Task key={task.project_id} task={task} statusColor={statusColor} />
      ))}
    </div>
  );
};

const Test = () => {
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

  const handleDrop = (item, newStatus) => {
    if (item.currentStatus !== newStatus) {
      handleUpdateStatus(item.id, newStatus);
    }
  };

  // Group todos by status
  const groupedTodos = {
    mustdo: todo.filter((item) => item.status === 'mustdo'),
    inprogress: todo.filter((item) => item.status === 'inprogress'),
    finish: todo.filter((item) => item.status === 'finish'),
  };

  return (
    <DndProvider backend={HTML5Backend}>
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

        {/* Task Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            status="mustdo"
            tasks={groupedTodos.mustdo}
            statusColor="bg-red-500 text-white"
            onDrop={handleDrop}
          />
          <TaskColumn
            status="inprogress"
            tasks={groupedTodos.inprogress}
            statusColor="bg-yellow-500 text-white"
            onDrop={handleDrop}
          />
          <TaskColumn
            status="finish"
            tasks={groupedTodos.finish}
            statusColor="bg-green-500 text-white"
            onDrop={handleDrop}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default Test;
