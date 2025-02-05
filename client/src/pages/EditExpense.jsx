import React, { useEffect, useState } from "react";
import { Edit2, Trash2, X, Plus } from "lucide-react";

const ExpenseSystem = () => {
  const [expenses, setExpenses] = useState([]);
  const [filterExpenses, setFilterExpenses] = useState([]);
  const [filters, setFilters] = useState({ search: "" });
  const [newExpense, setNewExpense] = useState({
    employee_id: "",
    date: new Date().toISOString().substring(0, 10),
    type_expense: "",
    money: "",
    desc: "",
  });
  const [editExpense, setEditExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addError, setAddError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch expenses from the API using fetch
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/expense");
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const data = await response.json();
        setExpenses(data.listExpense);
        setFilterExpenses(data.listExpense);
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

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate &&
        matchesType &&
        matchesMoney
      );
    });

    setFilterExpenses(filtered);
  };

  const handleAddExpense = async () => {
    try {
      // Validate fields
      if (!newExpense.employee_id || !newExpense.date || !newExpense.money) {
        setAddError("Please fill out all required fields.");
        return;
      }

      const expenseData = {
        ...newExpense,
        date: new Date(newExpense.date).toISOString(),
      };

      // POST new expense
      const response = await fetch("http://localhost:8080/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      // Fetch updated expenses
      const updatedResponse = await fetch("http://localhost:8080/api/expense");
      const data = await updatedResponse.json();
      setExpenses(data.listExpense);
      setFilterExpenses(data.listExpense);

      // Reset form and close modal
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
      console.error("Error adding expense:", err);
      setAddError("Failed to add expense. Please try again.");
    }
  };

  const handleEditExpense = async () => {
    if (!editExpense) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/expense/${editExpense.expen_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editExpense,
            date: new Date(editExpense.date).toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update expense");
      }

      // Fetch updated expenses
      const updatedResponse = await fetch("http://localhost:8080/api/expense");
      const data = await updatedResponse.json();
      setExpenses(data.listExpense);
      setFilterExpenses(data.listExpense);

      // Close edit modal
      setShowEditModal(false);
      setEditExpense(null);
    } catch (err) {
      console.error("Error updating expense:", err);
      alert("Failed to update expense. Please try again.");
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteExpense = async (expenseId) => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/expense/${expenseId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      // Update local state immediately after successful deletion
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.expen_id !== expenseId)
      );
      setFilterExpenses((prevFilterExpenses) =>
        prevFilterExpenses.filter((expense) => expense.expen_id !== expenseId)
      );
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("An error occurred while deleting the expense. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setAddError("");
    setEditExpense(null);
  };

  const formatInputDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "allowed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search expenses..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none col-span-2"
            />
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Expense Type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select
              name="status"
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Allowed">Allowed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="mb-6">
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={20} />
              Add New Expense
            </button>
          </div>
        </div>

        {/* Expenses Table */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            <p className="text-gray-600 mt-2">Loading expenses...</p>
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Employee Name",
                    "Date",
                    "Type",
                    "Amount",
                    "Description",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filterExpenses.length > 0 ? (
                  filterExpenses.map((expense) => (
                    <tr
                      key={expense.expen_id}
                      className="border-b hover:bg-gray-100 transition"
                    >
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
                        ${expense.money}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.desc}
                      </td>
                      <td className="py-4 whitespace-nowrap text-xs font-medium ">
                        <span
                          className={`px-3 py-1 rounded-full ${getStatusColor(
                            expense.status
                          )}`}
                        >
                          {expense.status}
                        </span>
                      </td>
                      <td className="px-3  whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditExpense(expense);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 p-2 hover:text-blue-800 transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.expen_id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-500 p-6">
                      No expenses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Expense Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-96 p-6 rounded-lg shadow-2xl relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-blue-800 mb-6">
                Add New Expense
              </h2>

              <input
                type="number"
                placeholder="ไอดีพนักงาน"
                name="employee_id"
                value={newExpense.employee_id}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    [e.target.name]: e.target.value,
                  })
                }
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                name="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    [e.target.name]: e.target.value,
                  })
                }
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                name="type_expense"
                value={newExpense.type_expense}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    [e.target.name]: e.target.value,
                  })
                }
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกค่าใช้จ่าย</option>
                <option value="ค่าใช้จ่ายประจำ">ค่าใช้จ่ายประจำ</option>
                <option value="ค่าใช้จ่ายผันแปร">ค่าใช้จ่ายผันแปร</option>
                <option value="ค่าใช้จ่ายทางการเงิน">
                  ค่าใช้จ่ายทางการเงิน
                </option>
                <option value="ค่าใช้จ่ายลงทุน">ค่าใช้จ่ายลงทุน</option>
                <option value="ค่าใช้จ่ายที่ไม่เกี่ยวข้องกับการดำเนินงานหลัก">
                  ค่าใช้จ่ายที่ไม่เกี่ยวข้องกับการดำเนินงานหลัก
                </option>
                <option value="ค่าใช้จ่ายฉุกเฉิน">ค่าใช้จ่ายฉุกเฉิน</option>
              </select>

              <input
                type="number"
                placeholder="จำนวนเงิน"
                name="money"
                value={newExpense.money}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    [e.target.name]: e.target.value,
                  })
                }
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="คำอธิบาย"
                name="desc"
                value={newExpense.desc}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    [e.target.name]: e.target.value,
                  })
                }
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {addError && <p className="text-red-500 mb-4">{addError}</p>}

              <div className="flex justify-between">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                  onClick={handleAddExpense}
                >
                  Add Expense
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Expense Modal */}
        {showEditModal && editExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-96 p-6 rounded-lg shadow-2xl relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-black mb-6">
                แก้ไขข้อมูล
              </h2>
              <input
                type="text"
                name="employee_id"
                placeholder="EMPLOYEE ID"
                value={editExpense.employee_id}
                onChange={(e) =>
                  setEditExpense({
                    ...editExpense,
                    employee_id: e.target.value,
                  })
                }
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                name="date"
                value={formatInputDate(editExpense.date)}
                onChange={(e) =>
                  setEditExpense({ ...editExpense, date: e.target.value })
                }
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="type_expense"
                value={editExpense.type_expense}
                onChange={(e) =>
                  setEditExpense({
                    ...editExpense,
                    type_expense: e.target.value,
                  })
                }
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกค่าใช้จ่าย</option>
                <option value="ค่าใช้จ่ายประจำ">ค่าใช้จ่ายประจำ</option>
                <option value="ค่าใช้จ่ายผันแปร">ค่าใช้จ่ายผันแปร</option>
                <option value="ค่าใช้จ่ายทางการเงิน">
                  ค่าใช้จ่ายทางการเงิน
                </option>
                <option value="ค่าใช้จ่ายลงทุน">ค่าใช้จ่ายลงทุน</option>
                <option value="ค่าใช้จ่ายที่ไม่เกี่ยวข้องกับการดำเนินงานหลัก">
                  ค่าใช้จ่ายที่ไม่เกี่ยวข้องกับการดำเนินงานหลัก
                </option>
                <option value="ค่าใช้จ่ายฉุกเฉิน">ค่าใช้จ่ายฉุกเฉิน</option>
              </select>
              <input
                type="number"
                name="money"
                placeholder="AMOUNT"
                value={editExpense.money}
                onChange={(e) =>
                  setEditExpense({ ...editExpense, money: e.target.value })
                }
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="desc"
                placeholder="DESCRIPTION"
                value={editExpense.desc}
                onChange={(e) =>
                  setEditExpense({ ...editExpense, desc: e.target.value })
                }
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <select
                name="status"
                value={editExpense.status}
                onChange={(e) =>
                  setEditExpense({ ...editExpense, status: e.target.value })
                }
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Allowed">Allowed</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="flex justify-between">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                  onClick={handleEditExpense}
                >
                  Save Changes
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseSystem;
