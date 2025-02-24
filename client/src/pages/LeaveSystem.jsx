import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Search,
  ChevronDown,
  X,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

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
  const [newLeave, setNewLeave] = useState({
    firstname: "",
    lastname: "",
    leavetype: "",
    startdate: "",
    enddate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // แปลง JSON เป็น Object
    }
  }, []);

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

  const handleAddChange = (e) => {
    setNewLeave({ ...newLeave, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Ensure startdate is set to today if not already set
    const leaveToSubmit = {
      ...newLeave,
      startdate: newLeave.startdate || new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/leaverequest",
        leaveToSubmit
      );

      if (response.data && response.data.newRequest) {
        const addedLeave = response.data.newRequest;
        setLeaves((prevLeaves) => [...prevLeaves, addedLeave]);
        setFilteredLeaves((prevFiltered) => [...prevFiltered, addedLeave]);
        setNewLeave({
          employee_id: "",
          leavetype: "",
          startdate: new Date().toISOString().split("T")[0], // Reset with today's date
          enddate: "",
        });
        setIsModalOpen(false);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Failed to add new leave request:", error);
      if (error.response?.status === 404) {
        alert("ไม่มีไอดีในระบบ.");
      } else {
        alert("Failed to add new leave request. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
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
        return;
      }

      const response = await axios.put(
        `http://localhost:8080/api/leaverequest/${editData.leave_id}`,
        editData
      );

      const updatedLeave = response.data.leaveRequest;

      if (!updatedLeave || !updatedLeave.leave_id) {
        console.error(
          "Updated leave is invalid. Response data:",
          response.data
        );
        alert("Error: Unable to update leave.");
        return;
      }

      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave && leave.leave_id === updatedLeave.leave_id
            ? updatedLeave
            : leave
        )
      );

      setFilteredLeaves((prevFilteredLeaves) =>
        prevFilteredLeaves.map((leave) =>
          leave && leave.leave_id === updatedLeave.leave_id
            ? updatedLeave
            : leave
        )
      );

      setIsEditModalOpen(false);
      setEditData(null);
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save changes.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "allowed":
        return "bg-green-100 text-green-800";
      case "not allowed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg shadow flex items-center gap-2">
          <X className="w-5 h-5" />
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="search"
                placeholder="Search by name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <div className="relative">
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                name="leaveType"
                className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.leaveType}
                onChange={handleFilterChange}
              >
                <option value="">All Leave Types</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Private Leave">Private Leave</option>
                <option value="Annual Leave">Annual Leave</option>
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="startDate"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="endDate"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Request
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Employee
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Leave Type
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Date Range
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  {user?.role === "admin" && (
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeaves.map((leave) => (
                  <tr
                    key={leave.leave_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {leave.firstname} {leave.lastname}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {leave.leavetype}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(leave.startdate)} -{" "}
                      {formatDate(leave.enddate)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          leave.status
                        )}`}
                      >
                        {leave.status || "Pending"}
                      </span>
                    </td>
                    {user?.role === "admin" && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(leave)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm mr-3"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(leave.leave_id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="relative">
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <select
                    name="status"
                    className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editData?.status || ""}
                    onChange={handleEditChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Allowed">Allowed</option>
                    <option value="Not Allowed">Not Allowed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6">
              New Leave Request
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employee_id"
                  placeholder="Enter employee ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newLeave.employee_id}
                  onChange={handleAddChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type
                </label>
                <div className="relative">
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <select
                    name="leavetype"
                    className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newLeave.leavetype}
                    onChange={handleAddChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Private Leave">Private Leave</option>
                    <option value="Annual Leave">Annual Leave</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      name="startdate"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newLeave.startdate}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      name="enddate"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newLeave.enddate}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveStatus;
