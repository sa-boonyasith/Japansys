import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveSystem = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    firstname: "",
    lastname: "",
    leavetype: "",
    startdate: "",
    enddate: "",
  });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/leaverequest"
        );
        if (Array.isArray(response.data.listLeaveRequest)) {
          setLeaves(response.data.listLeaveRequest);
          setFilteredLeaves(response.data.listLeaveRequest);
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
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const handleAddChange = (e) => {
    setNewLeave({ ...newLeave, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/leaverequest",
        newLeave
      );
  
      // Ensure the response contains the new leave request
      if (response.data && response.data.newRequest) {
        const addedLeave = response.data.newRequest;
  
        // Update the leaves and filteredLeaves states
        setLeaves((prevLeaves) => [...prevLeaves, addedLeave]);
        setFilteredLeaves((prevFiltered) => [...prevFiltered, addedLeave]);
  
        // Reset the form fields
        setNewLeave({
          employee_id:"",
          leavetype: "",
          startdate: "",
          enddate: "",
        });
  
        // Close the modal
        setIsModalOpen(false);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Failed to add new leave request:", error);
      alert("Failed to add new leave request. Please try again.");
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          เพิ่มรายชื่อการลา
        </button>
      </div>

      {/* Add New Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add New Leave Request</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="employee_id"
                  placeholder="Employee ID"
                  className="border border-gray-300 p-2 rounded"
                  value={newLeave.employee_id}
                  onChange={handleAddChange}
                  required
                />
                <select
                  name="leavetype"
                  className="border border-gray-300 p-2 rounded"
                  value={newLeave.leavetype}
                  onChange={handleAddChange}
                  required
                >
                  <option value="">Select Leave Type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Private Leave">Private Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                </select>
                <input
                  type="date"
                  name="startdate"
                  className="border border-gray-300 p-2 rounded"
                  value={newLeave.startdate}
                  onChange={handleAddChange}
                  required
                />
                <input
                  type="date"
                  name="enddate"
                  className="border border-gray-300 p-2 rounded"
                  value={newLeave.enddate}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Leave Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Table */}
      <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border border-gray-300 p-2">Employee name</th>
            <th className="border border-gray-300 p-2">Leave type</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Status</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveSystem;

