import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Status = () => {
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      employeeName: "Firstname Lastname",
      leaveType: "Sick Leave",
      startDate: "2024-02-18",
      endDate: "2024-02-19",
      status: "Allowed",
    },
    {
      id: 2,
      employeeName: "Firstname Lastname",
      leaveType: "Private Leave",
      startDate: "2024-02-18",
      endDate: "2024-02-19",
      status: "Allowed",
    },
    {
      id: 3,
      employeeName: "Firstname Lastname",
      leaveType: "Annual Leave",
      startDate: "2024-02-18",
      endDate: "2024-02-19",
      status: "Not Allowed",
    },
  ]);

  const [filters, setFilters] = useState({
    search: "",
    leaveType: "",
    status: "",
    startDate: null,
    endDate: null,
  });

  const [editModal, setEditModal] = useState({ isOpen: false, leave: null });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, date) => {
    setFilters({ ...filters, [name]: date });
  };

  const handleEdit = (leave) => {
    setEditModal({ isOpen: true, leave });
  };

  const handleSaveEdit = () => {
    setLeaves(
      leaves.map((l) =>
        l.id === editModal.leave.id ? { ...editModal.leave } : l
      )
    );
    setEditModal({ isOpen: false, leave: null });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this leave?")) {
      setLeaves(leaves.filter((leave) => leave.id !== id));
    }
  };

  const handleEditChange = (e) => {
    setEditModal({
      ...editModal,
      leave: { ...editModal.leave, [e.target.name]: e.target.value },
    });
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search for Name"
          className="border border-gray-300 p-2 rounded w-full md:w-1/2"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select
          name="leaveType"
          className="border border-gray-300 p-2 rounded w-full md:w-[500px]"
          value={filters.leaveType}
          onChange={handleFilterChange}
        >
          <option value="">Select a leave type</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Private Leave">Private Leave</option>
          <option value="Annual Leave">Annual Leave</option>
        </select>
        <select
          name="status"
          className="border border-gray-300 p-2 rounded w-full md:w-[500px]"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Select a status</option>
          <option value="Allowed">Allowed</option>
          <option value="Not Allowed">Not Allowed</option>
        </select>
        <div className="flex gap-2 w-full md:w-1/2 items-center">
          <DatePicker
            selected={filters.startDate}
            onChange={(date) => handleDateChange("startDate", date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Start Date"
            className="border border-gray-300 p-2 rounded flex-1"
          />
          <DatePicker
            selected={filters.endDate}
            onChange={(date) => handleDateChange("endDate", date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="End Date"
            className="border border-gray-300 p-2 rounded flex-1"
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {/* Leave Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2">Employee name</th>
            <th className="border border-gray-300 p-2">Leave type</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td className="border border-gray-300 p-2">
                {leave.employeeName}
              </td>
              <td className="border border-gray-300 p-2">{leave.leaveType}</td>
              <td className="border border-gray-300 p-2">
                {leave.startDate} - {leave.endDate}
              </td>
              <td className="border border-gray-300 p-2">{leave.status}</td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleEdit(leave)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(leave.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Leave</h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                name="employeeName"
                placeholder="Employee Name"
                value={editModal.leave.employeeName}
                onChange={handleEditChange}
                className="border border-gray-300 p-2 rounded"
              />
              <select
                name="leaveType"
                value={editModal.leave.leaveType}
                onChange={handleEditChange}
                className="border border-gray-300 p-2 rounded"
              >
                <option value="Sick Leave">Sick Leave</option>
                <option value="Private Leave">Private Leave</option>
                <option value="Annual Leave">Annual Leave</option>
              </select>
              <div className="flex gap-2">
                <DatePicker
                  selected={new Date(editModal.leave.startDate)}
                  onChange={(date) =>
                    setEditModal({
                      ...editModal,
                      leave: {
                        ...editModal.leave,
                        startDate: date.toISOString().split("T")[0],
                      },
                    })
                  }
                  dateFormat="yyyy-MM-dd"
                  className="border border-gray-300 p-2 rounded flex-1"
                />
                <DatePicker
                  selected={new Date(editModal.leave.endDate)}
                  onChange={(date) =>
                    setEditModal({
                      ...editModal,
                      leave: {
                        ...editModal.leave,
                        endDate: date.toISOString().split("T")[0],
                      },
                    })
                  }
                  dateFormat="yyyy-MM-dd"
                  className="border border-gray-300 p-2 rounded flex-1"
                />
              </div>
              <select
                name="status"
                value={editModal.leave.status}
                onChange={handleEditChange}
                className="border border-gray-300 p-2 rounded"
              >
                <option value="Allowed">Allowed</option>
                <option value="Not Allowed">Not Allowed</option>
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                onClick={() => setEditModal({ isOpen: false, leave: null })}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
