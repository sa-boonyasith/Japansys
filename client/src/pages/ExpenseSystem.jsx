import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExpenseSystem = () => {
  const [expenses, setExpenses] = useState([]);
  const [filterExpense, setFilterExpense] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    date: "",
    money: "",
    desc: "",
  });
  const [newExpense, setNewExpense] = useState({
    employee_id: "",
    date: "",
    type_expense: "",
    money: "",
    desc: "",
  });
  const [editing, setEditing] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลจาก API เมื่อโหลดหน้า
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/expense');
        setExpenses(response.data.listExpense);
        setFilterExpense(response.data.listExpense);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError('Failed to fetch expenses.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // ฟังก์ชันสำหรับกรองข้อมูล
  useEffect(() => {
    let filtered = expenses.filter((expense) =>
      (expense.firstname.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.lastname.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.type_expense.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.money.toString().includes(filters.search) ||
        expense.desc.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.type ? expense.type_expense.toLowerCase().includes(filters.type.toLowerCase()) : true) &&
      (filters.date ? new Date(expense.date).toLocaleDateString().includes(filters.date) : true) &&
      (filters.money ? expense.money.toString().includes(filters.money) : true) &&
      (filters.desc ? expense.desc.toLowerCase().includes(filters.desc.toLowerCase()) : true)
    );
    setFilterExpense(filtered);
  }, [filters, expenses]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const handleAddExpense = () => {
    // ฟังก์ชันสำหรับเพิ่มค่าใช้จ่ายใหม่
    axios.post('http://localhost:8080/api/expense', newExpense)
      .then((response) => {
        setExpenses([...expenses, response.data]);
        setShowAddModal(false);
      })
      .catch((error) => {
        console.error('Error adding expense:', error);
      });
  };

  return (
    <div className="p-6">
      {/* Search and Filter */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Type"
            value={filters.type}
            onChange={handleFilterChange}
            name="type"
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            value={filters.date}
            onChange={handleFilterChange}
            name="date"
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Money"
            value={filters.money}
            onChange={handleFilterChange}
            name="money"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Description"
            value={filters.desc}
            onChange={handleFilterChange}
            name="desc"
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Add Button */}
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={() => setShowAddModal(true)}
        >
          Add Expense
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border border-gray-300 p-2">Employee Name</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Money</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filterExpense.length > 0 ? (
              filterExpense.map((expense) => (
                <tr key={expense.id}>
                  <td className="border text-center border-gray-300 p-2">{expense.firstname} {expense.lastname}</td>
                  <td className="border text-center border-gray-300 p-2">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="border text-center border-gray-300 p-2">{expense.type_expense}</td>
                  <td className="border text-center border-gray-300 p-2">{expense.money}</td>
                  <td className="border text-center border-gray-300 p-2">{expense.desc}</td>
                  <td className='border text-center border-gray-300 p-2'>{expense.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 p-4">
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl mb-4">Add New Expense</h2>
            <input
              type="text"
              placeholder="Employee ID"
              value={newExpense.employee_id}
              onChange={(e) => setNewExpense({ ...newExpense, employee_id: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Type"
              value={newExpense.type_expense}
              onChange={(e) => setNewExpense({ ...newExpense, type_expense: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.money}
              onChange={(e) => setNewExpense({ ...newExpense, money: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <textarea
              placeholder="Description"
              value={newExpense.desc}
              onChange={(e) => setNewExpense({ ...newExpense, desc: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <button
              className="bg-blue-500 text-white p-2 rounded mr-2"
              onClick={handleAddExpense}
            >
              Add Expense
            </button>
            <button
              className="bg-gray-500 text-white p-2 rounded"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSystem;
