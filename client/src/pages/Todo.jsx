import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ITEM_TYPE = 'TASK';

const Task = ({ task, onEdit, onDelete }) => {
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
      className={`p-4 border rounded shadow-md bg-white transition transform ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-lg'
      }`}
    >
      <p className="font-bold text-lg text-gray-800">ชื่อโปรเจค: {task.project_name}</p>
      <p className="text-sm text-gray-500 mt-1">ชื่อที่ต้องทำ: {task.todo}</p>
      <p className="text-gray-600 mt-2">รายละเอียดงาน: {task.desc || 'No description provided.'}</p>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onEdit(task)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          แก้ไข
        </button>
        <button
          onClick={() => onDelete(task.project_id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          ลบ
        </button>
      </div>
    </div>
  );
};

const TaskColumn = ({ status, tasks, onDrop, onEdit, onDelete }) => {
  const [, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item) => onDrop(item, status),
  }));

  return (
    <div
      ref={drop}
      className="space-y-4 p-4 bg-gray-100 rounded min-h-[300px] shadow-md"
    >
      <h2 className="text-xl font-bold mb-4">
        {status === 'mustdo' ? 'งานที่ต้องทำ' : status === 'inprogress' ? 'งานที่กำลังทำ' : 'งานที่เสร็จแล้ว'}
      </h2>
      {tasks.map((task) => (
        <Task key={task.project_id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

const Todo = () => {
  const [todo, setTodo] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ project_name: '', desc: '' });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/todo');
      setTodo(res.data.listproject);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    }
  };

  const handleAddOrEdit = async () => {
    try {
      if (editingTask) {
        await axios.put(`http://localhost:8080/api/todo/${editingTask.project_id}`, newTask);
      } else {
        await axios.post('http://localhost:8080/api/todo', newTask);
      }
      fetchTodo();
      setModalOpen(false);
      setNewTask({ project_name: '', desc: '' });
      setEditingTask(null);
    } catch (err) {
      setError('Failed to save task');
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask({ project_name: task.project_name, desc: task.desc });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/todo/${id}`);
      fetchTodo();
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/todo/${id}`, { status: newStatus });
      fetchTodo();
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

  const groupedTodos = {
    mustdo: todo.filter((item) => item.status === 'mustdo'),
    inprogress: todo.filter((item) => item.status === 'inprogress'),
    finish: todo.filter((item) => item.status === 'finish'),
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 relative">
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            สร้าง Task
          </button>
        </div>

        {modalOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setModalOpen(false)}
            ></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">{editingTask ? 'แก้ไข Task' : 'เพิ่ม Task ใหม่'}</h2>
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
                    onClick={handleAddOrEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            status="mustdo"
            tasks={groupedTodos.mustdo}
            onDrop={handleDrop}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <TaskColumn
            status="inprogress"
            tasks={groupedTodos.inprogress}
            onDrop={handleDrop}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <TaskColumn
            status="finish"
            tasks={groupedTodos.finish}
            onDrop={handleDrop}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default Todo;
