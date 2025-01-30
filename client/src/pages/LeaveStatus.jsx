import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    leaveType: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch leave data from API
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/leaverequest"
        );
        if (Array.isArray(response.data.listLeaveRequest)) {
          setLeaves(response.data.listLeaveRequest);
          setFilteredLeaves(response.data.listLeaveRequest); // Set initial filtered data
        } else {
          setError(
            "Expected an array of leave requests, but got something else."
          );
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    const filtered = leaves.filter((leave) => {
      const searchFilter = currentFilters.search
        ? leave.firstname
            .toLowerCase()
            .includes(currentFilters.search.toLowerCase()) ||
          leave.lastname
            .toLowerCase()
            .includes(currentFilters.search.toLowerCase())
        : true;
      const typeFilter = currentFilters.leaveType
        ? leave.leavetype === currentFilters.leaveType
        : true;
      const statusFilter = currentFilters.status
        ? leave.status === currentFilters.status
        : true;
      const startDateFilter = currentFilters.startDate
        ? new Date(leave.startdate) >= new Date(currentFilters.startDate)
        : true;
      const endDateFilter = currentFilters.endDate
        ? new Date(leave.enddate) <= new Date(currentFilters.endDate)
        : true;

      return (
        searchFilter &&
        typeFilter &&
        statusFilter &&
        startDateFilter &&
        endDateFilter
      );
    });
    setFilteredLeaves(filtered);
  };

  const resetFilters = () => {
    const initialFilters = {
      search: "",
      leaveType: "",
      status: "",
      startDate: "",
      endDate: "",
    };
    setFilters(initialFilters);
    setFilteredLeaves(leaves);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
  };

  const handleDelete = async (leaveId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:8080/api/leaverequest/${leaveId}`);
        setLeaves(leaves.filter((leave) => leave.leave_id !== leaveId));
        setFilteredLeaves(
          filteredLeaves.filter((leave) => leave.leave_id !== leaveId)
        );
      } catch (error) {
        alert("Failed to delete the record.");
      }
    }
  };

  const handleEdit = (leave) => {
    setEditData(leave);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      if (!editData || !editData.leave_id) {
        console.error("No leave data or leave_id found.");
        alert("Invalid leave data.");
        return; // Stop execution if no data
      }
  
      console.log("Saving...", editData); // Debug: Log the editData being saved
  
      // Send the PUT request to update the leave
      const response = await axios.put(
        `http://localhost:8080/api/leaverequest/${editData.leave_id}`,
        editData
      );
  
      console.log("Response:", response.data); // Debug: Log the entire API response
  
      // Get the leaveRequest from the response
      const updatedLeave = response.data.leaveRequest;
  
      // Check if the updatedLeave is valid
      if (!updatedLeave || !updatedLeave.leave_id) {
        console.error("Updated leave is invalid. Response data:", response.data);
        alert("Error: Unable to update leave.");
        return;
      }
  
      // Update the leaves list
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave && leave.leave_id === updatedLeave.leave_id ? updatedLeave : leave
        )
      );
  
      // Update the filtered leaves list
      setFilteredLeaves((prevFilteredLeaves) =>
        prevFilteredLeaves.map((leave) =>
          leave && leave.leave_id === updatedLeave.leave_id ? updatedLeave : leave
        )
      );
  
      // Close the modal and reset edit data
      setIsEditModalOpen(false);
      setEditData(null);
  
    } catch (error) {
      // Log the error in case of failure
      console.error("Error saving:", error);
      alert("Failed to save changes.");
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 min-h-screen ">
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search for Name"
          className="border border-gray-300 p-2 rounded w-full md:w-1/5"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select
          name="leaveType"
          className="border text-gray-400 border-gray-300 p-2 rounded w-full md:w-1/5"
          value={filters.leaveType}
          onChange={handleFilterChange}
        >
          <option value="">Select a Leave Type</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Private Leave">Private Leave</option>
          <option value="Annual Leave">Annual Leave</option>
        </select>
        <div className="flex gap-2 w-full md:w-2/5">
          <input
            type="date"
            name="startDate"
            className="border text-gray-400 border-gray-300 p-2 rounded flex-1"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="endDate"
            className="border text-gray-400 border-gray-300 p-2 rounded flex-1"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
        <button
          onClick={resetFilters}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* Leave Table */}
      <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border border-gray-300 p-2">Employee name</th>
            <th className="border border-gray-300 p-2">Leave type</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th> 
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.map((leave) => (
            <tr key={leave.leave_id}>
              <td className="border text-center border-gray-300 p-2">
                {leave.firstname} {leave.lastname}
              </td>
              <td className="border text-center border-gray-300 p-2">{leave.leavetype}</td>
              <td className="border border-gray-300 p-2 text-center">
                {formatDate(leave.startdate)} - {formatDate(leave.enddate)}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {leave.status}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  onClick={() => handleEdit(leave)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(leave.leave_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="mb-4">
              <label className="block text-sm font-medium">Status</label>
              <select
                name="status"
                value={editData.status}
                onChange={handleEditChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="">Select Status</option>
                <option value="Allowed">Allowed</option>
                <option value="Not Allowed">Not Allowed</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
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

export default LeaveStatus;
