import React, { useState } from "react";

const ExpenseSystem = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    category: "",
  });
  const [newExpense, setNewExpense] = useState({
    employeeId: "",
    date: "",
    category: "",
    amount: "",
    description: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);

  const expenseCategories = [
    "ค่าเดินทาง",
    "ค่าที่พัก",
    "ค่าอาหาร",
    "ค่าอุปกรณ์สำนักงาน",
    "อื่นๆ",
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    const filtered = expenses.filter((expense) => {
      return (
        (!currentFilters.search ||
          expense.description.toLowerCase().includes(currentFilters.search.toLowerCase())) &&
        (!currentFilters.startDate || new Date(expense.date) >= new Date(currentFilters.startDate)) &&
        (!currentFilters.endDate || new Date(expense.date) <= new Date(currentFilters.endDate)) &&
        (!currentFilters.category || expense.category === currentFilters.category)
      );
    });
    setFilteredExpenses(filtered);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      startDate: "",
      endDate: "",
      category: "",
    });
    setFilteredExpenses(expenses);
  };

  const handleModalChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleAddExpense = () => {
    if (!newExpense.employeeId || !newExpense.date || !newExpense.category || !newExpense.amount) {
      alert("Please fill out all required fields.");
      return;
    }

    const newRecord = { ...newExpense, id: expenses.length + 1 };
    setExpenses([...expenses, newRecord]);
    setFilteredExpenses([...filteredExpenses, newRecord]);
    setShowAddModal(false);
    setNewExpense({
      employeeId: "",
      date: "",
      category: "",
      amount: "",
      description: "",
    });
  };

  return (
    <div className="p-6">
      <div className="shadow-md p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search by description"
            className="border border-gray-300 p-2 rounded w-full md:w-1/5"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <div className="flex gap-2 w-full md:w-2/5">
            <input
              type="date"
              name="startDate"
              className="border border-gray-300 p-2 rounded flex-1"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="endDate"
              className="border border-gray-300 p-2 rounded flex-1"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <select
            name="category"
            className="border border-gray-300 p-2 rounded w-full md:w-1/5"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {expenseCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Expense
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border border-gray-300 p-2">Employee ID</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Amount</th>
            <th className="border border-gray-300 p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr key={expense.id}>
              <td className="border text-center border-gray-300 p-2">{expense.employeeId}</td>
              <td className="border text-center border-gray-300 p-2">{expense.date}</td>
              <td className="border text-center border-gray-300 p-2">{expense.category}</td>
              <td className="border text-center border-gray-300 p-2">{expense.amount}</td>
              <td className="border text-center border-gray-300 p-2">{expense.description}</td>
            </tr>
          ))}
          {filteredExpenses.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 p-4">
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Add Expense</h2>
            <input
              type="text"
              name="employeeId"
              placeholder="Employee ID"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newExpense.employeeId}
              onChange={handleModalChange}
            />
            <input
              type="date"
              name="date"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newExpense.date}
              onChange={handleModalChange}
            />
            <select
              name="category"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newExpense.category}
              onChange={handleModalChange}
            >
              <option value="">Select Category</option>
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newExpense.amount}
              onChange={handleModalChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newExpense.description}
              onChange={handleModalChange}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSystem;
