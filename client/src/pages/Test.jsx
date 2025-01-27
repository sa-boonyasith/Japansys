import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // Fetch expenses from the API
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

  const handleEditExpense = async () => {
    if (!editExpense) {
      alert("Please select expense to edit");
      return;
    }
    try {
      const payload ={
        ...editExpense ,
        employee_id : parseInt(editExpense.employee_id),
      }


      console.log("Sending data to server:", editExpense);
      const res = await axios.put(
        `http://localhost:8080/api/expense/${editExpense.expen_id}`,
        payload
      );
      console.log("Response from server:", res.data);
      if (res.status === 200 && res.data?.update) {
        const updatedExpenses = expenses.map((expense) =>
          expense.expen_id === editExpense.expen_id
            ? { ...expense, ...res.data.update }
            : expense
        );
  
        setExpenses(updatedExpenses);
        setFilterExpenses(updatedExpenses);
        setShowEditModal(false);
        setEditExpense(null);
      } else {
        alert("Unexpected response from the server");
      }
    } catch (err) {
      console.error("Error updating expense:", err);
      alert("Failed to update expense. Please try again.");
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
        } else {
          alert("Unexpected response from the server");
        }
      } catch (err) {
        console.error("Error deleting expense:", err);
        alert("Failed to delete expense. Please try again.");
      }
    }
  };
  const formatInputDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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

      await axios.post("http://localhost:8080/api/expense", expenseData);

      // Fetch updated expenses
      const response = await axios.get("http://localhost:8080/api/expense");
      setExpenses(response.data.listExpense);
      setFilterExpenses(response.data.listExpense);

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

  const closeModal = () => {
    setShowAddModal(false);
    setAddError("");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col mb-4  shadow-lg p-2 bg-white rounded">
        <div className="flex flex-row gap-2">
          {/* Search Bar */}
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search..."
            className="border p-2 rounded w-full h-10 "
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full h-10 "
          />
          <input
            type="text"
            placeholder="Type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full mb-4 h-10"
          />
          <input
            type="text"
            placeholder="money"
            name="money"
            value={filters.money}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full mb-4 h-10"
          />
          <select
            name="status"
            className="border border-gray-300 p-2 rounded w-full md:w1/5 h-10  mb-4 "
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Allowed">Allowed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="flex flex-row gap-4 ">
          <button
            className="bg-green-500 text-white p-2 rounded mb-4"
            onClick={() => setShowAddModal(true)}
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              {[
                "Employee Name",
                "Date",
                "Type",
                "Money",
                "Description",
                "Status",
                "Action",
              ].map((header) => (
                <th key={header} className="border border-gray-300 p-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filterExpenses.length > 0 ? (
              filterExpenses.map((expense) => (
                <tr key={expense.expen_id}>
                  <td className="border text-center border-gray-300 p-2">
                    {expense.firstname} {expense.lastname}
                  </td>
                  <td className="border text-center border-gray-300 p-2">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="border text-center border-gray-300 p-2">
                    {expense.type_expense}
                  </td>
                  <td className="border text-center border-gray-300 p-2">
                    {expense.money}
                  </td>
                  <td className="border text-center border-gray-300 p-2">
                    {expense.desc}
                  </td>
                  <td className="border text-center border-gray-300 p-2">
                    {expense.status}
                  </td>
                  <td className="border text-center border-gray-300 p-2">
                    <button
                      onClick={() => {
                        setEditExpense(expense);
                        setShowEditModal(true);
                      }}
                      className="bg-blue-500 text-white p-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense.expen_id)}
                      className="bg-red-500 text-white p-2 rounded ml-2"
                    >
                      Delete
                    </button>
                  </td>
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
            {["employee_id", "date", "type_expense", "money", "desc"].map(
              (field) => (
                <input
                  key={field}
                  type={
                    field === "date"
                      ? "date"
                      : field === "money"
                      ? "number"
                      : "text"
                  }
                  placeholder={field.replace("_", " ").toUpperCase()}
                  name={field}
                  value={newExpense[field]}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, [field]: e.target.value })
                  }
                  className="border p-2 rounded mb-2 w-full"
                />
              )
            )}
            {addError && <p className="text-red-500 mb-2">{addError}</p>}
            <button
              className="bg-blue-500 text-white p-2 rounded mr-2"
              onClick={handleAddExpense}
            >
              Add Expense
            </button>
            <button
              className="bg-gray-500 text-white p-2 rounded"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showEditModal && editExpense && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-4/5 md:w-1/3">
            <h2 className="text-xl mb-4">Edit Expense</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="employee_id"
                placeholder="Employee ID"
                className="border border-gray-300 p-2 rounded"
                value={editExpense.employee_id}
                onChange={(e) =>
                  setEditExpense({
                    ...editExpense,
                    employee_id: e.target.value,
                  })
                }
              />
              <input
                type="date"
                name="date"
                className="border border-gray-300 p-2 rounded"
                value={formatInputDate(editExpense.date)}
                onChange={(e) =>
                  setEditExpense({ ...editExpense, date: e.target.value })
                }
              />
              <input
                type="text"
                name="type_expense"
                placeholder="Type of Expense"
                className="border border-gray-300 p-2 rounded"
                value={editExpense.type_expense}
                onChange={(e) =>
                  setEditExpense({
                    ...editExpense,
                    type_expense: e.target.value,
                  })
                }
              />
              <input
                type="number"
                name="money"
                placeholder="Amount"
                className="border border-gray-300 p-2 rounded"
                value={editExpense.money}
                onChange={(e) =>
                  setEditExpense({ ...editExpense, money: e.target.value })
                }
              />
              <input
                type="text"
                name="desc"
                placeholder="Description"
                className="border border-gray-300 p-2 rounded"
                value={editExpense.desc}
                onChange={(e) =>
                  setEditExpense({ ...editExpense, desc: e.target.value })
                }
              />
              <select
                name="status"
                className="border border-gray-300 p-2 rounded"
                value={editExpense.status}
                onChange={(e) =>
                  setEditExpense({ ...editExpense, status: e.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Allowed">Allowed</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleEditExpense}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSystem;
