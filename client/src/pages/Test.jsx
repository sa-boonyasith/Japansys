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

  // Fetch leave data from API
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/leaverequest");
        if (Array.isArray(response.data.listLeaveRequest)) {
          setLeaves(response.data.listLeaveRequest);
          setFilteredLeaves(response.data.listLeaveRequest); // Set initial filtered data
        } else {
          setError("Expected an array of leave requests, but got something else.");
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
        ? leave.firstname.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          leave.lastname.toLowerCase().includes(currentFilters.search.toLowerCase())
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
        searchFilter && typeFilter && statusFilter && startDateFilter && endDateFilter
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
          className="border border-gray-300 p-2 rounded w-full md:w-1/5"
          value={filters.leaveType}
          onChange={handleFilterChange}
        >
          <option value="">เลือกประเภทการลา</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Private Leave">Private Leave</option>
          <option value="Annual Leave">Annual Leave</option>
        </select>
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
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.map((leave) => (
            <tr key={leave.leave_id}>
              <td className="border border-gray-300 p-2">
                {leave.firstname} {leave.lastname}
              </td>
              <td className="border border-gray-300 p-2">{leave.leavetype}</td>
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
