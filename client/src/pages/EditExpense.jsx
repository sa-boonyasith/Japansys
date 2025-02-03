import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";

const ExpenseSystem = () => {
  const [expenses, setExpenses] = useState([]);
  const [filterExpenses, setFilterExpenses] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    date: "",
    type: "",
    money: "",
    status: "",
  });
  const [newExpense, setNewExpense] = useState({
    employee_id: "",
    date: new Date().toISOString().substring(0, 10),
    type_expense: "",
    money: "",
    desc: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addError, setAddError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/expense");
        setExpenses(response.data.listExpense);
        setFilterExpenses(response.data.listExpense);
      } catch (err) {
        setError("Failed to fetch expenses.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value.trim() };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (filters) => {
    const filtered = expenses.filter((expense) => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = searchTerm
        ? [
            expense.firstname || "",
            expense.lastname || "",
            expense.type_expense || "",
            expense.money.toString() || "",
            expense.desc || "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm)
        : true;

      const matchesStatus = filters.status
        ? expense.status.toLowerCase() === filters.status.toLowerCase()
        : true;

      const matchesDate = filters.date
        ? new Date(expense.date).toISOString().split("T")[0] === filters.date
        : true;

      const matchesType = filters.type
        ? expense.type_expense.toLowerCase() === filters.type.toLowerCase()
        : true;

      const matchesMoney = filters.money
        ? parseFloat(expense.money) === parseFloat(filters.money)
        : true;

      return matchesSearch && matchesStatus && matchesDate && matchesType && matchesMoney;
    });

    setFilterExpenses(filtered);
  };

  const handleEditExpense = async () => {
    if (!editExpense) return;

    try {
      const res = await axios.put(
        `http://localhost:8080/api/expense/${editExpense.expen_id}`,
        editExpense
      );

      if (res.status === 200 && res.data?.data) {
        const updatedExpenses = expenses.map((expense) =>
          expense.expen_id === editExpense.expen_id
            ? { ...expense, ...res.data.data }
            : expense
        );

        setExpenses(updatedExpenses);
        setFilterExpenses(updatedExpenses);
        setShowEditModal(false);
        setEditExpense(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update expense. Please try again.");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        const res = await axios.delete(
          `http://localhost:8080/api/expense/${expenseId}`
        );
        if (res.status === 200 && res.data?.delete) {
          const updatedExpenses = expenses.filter(
            (expense) => expense.expen_id !== expenseId
          );
          setExpenses(updatedExpenses);
          setFilterExpenses(updatedExpenses);
        }
      } catch (err) {
        alert("Failed to delete expense. Please try again.");
      }
    }
  };

  const formatInputDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleAddExpense = async () => {
    try {
      if (!newExpense.employee_id || !newExpense.date || !newExpense.money) {
        setAddError("Please fill out all required fields.");
        return;
      }

      const expenseData = {
        ...newExpense,
        date: new Date(newExpense.date).toISOString(),
      };

      await axios.post("http://localhost:8080/api/expense", expenseData);
      const response = await axios.get("http://localhost:8080/api/expense");
      setExpenses(response.data.listExpense);
      setFilterExpenses(response.data.listExpense);
      setShowAddModal(false);
      setNewExpense({
        employee_id: "",
        date: new Date().toISOString().substring(0, 10),
        type_expense: "",
        money: "",
        desc: "",
      });
      setAddError("");
    } catch (err) {
      setAddError("Failed to add expense. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'allowed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const Modal = ({ children, title, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search..."
                className="pl-10 w-full h-8  border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="h-8  border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="h-8  border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Amount"
              name="money"
              value={filters.money}
              onChange={handleFilterChange}
              className="h-8  border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="h-8  border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Allowed">Allowed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Expense
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Employee Name", "Date", "Type", "Amount", "Description", "Status", "Actions"].map((header) => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filterExpenses.length > 0 ? (
                    filterExpenses.map((expense) => (
                      <tr key={expense.expen_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {expense.firstname} {expense.lastname}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expense.type_expense}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${Number(expense.money).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {expense.desc}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                            {expense.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditExpense(expense);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense.expen_id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No expenses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAddModal && (
          <Modal title="Add New Expense" onClose={() => setShowAddModal(false)}>
            <div className="p-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Employee ID"
                  value={newExpense.employee_id}
                  onChange={(e) => setNewExpense({ ...newExpense, employee_id: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Type of Expense"
                  value={newExpense.type_expense}
                  onChange={(e) => setNewExpense({ ...newExpense, type_expense: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.money}
                  onChange={(e) => setNewExpense({ ...newExpense, money: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  placeholder="Description"
                  value={newExpense.desc}
                  onChange={(e) => setNewExpense({ ...newExpense, desc: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
                {addError && (
                  <div className="text-red-500 text-sm">{addError}</div>
                )}
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExpense}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Add Expense
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {showEditModal && editExpense && (
          <Modal title="Edit Expense" onClose={() => setShowEditModal(false)}>
            <div className="p-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Employee ID"
                  value={editExpense.employee_id}
                  onChange={(e) => setEditExpense({ ...editExpense, employee_id: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={formatInputDate(editExpense.date)}
                  onChange={(e) => setEditExpense({ ...editExpense, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Type of Expense"
                  value={editExpense.type_expense}
                  onChange={(e) => setEditExpense({ ...editExpense, type_expense: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={editExpense.money}
                  onChange={(e) => setEditExpense({ ...editExpense, money: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  placeholder="Description"
                  value={editExpense.desc}
                  onChange={(e) => setEditExpense({ ...editExpense, desc: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
                <select
                  value={editExpense.status}
                  onChange={(e) => setEditExpense({ ...editExpense, status: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Allowed">Allowed</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditExpense}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ExpenseSystem;