import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Search,
  Plus,
  Clock,
  ChevronDown,
  X,
  Edit,
  Trash2,
} from "lucide-react";

const EditCustomerMeeting = () => {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const [newMeeting, setNewMeeting] = useState({
    customer_id: "",
    startdate: "",
    enddate: "",
    timestart: "",
    timeend: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMeeting, setEditMeeting] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/customer");
        setCustomers(response.data.listCustomer);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/meetingcus"
        );
        if (response.data && Array.isArray(response.data.listmeetingcustomer)) {
          const today = new Date();
          const sortedMeetings = response.data.listmeetingcustomer.sort(
            (a, b) => {
              const diffA = Math.abs(new Date(a.startdate) - today);
              const diffB = Math.abs(new Date(b.startdate) - today);
              return diffA - diffB;
            }
          );
          setMeetings(sortedMeetings);
          setFilteredMeetings(sortedMeetings);
        } else {
          setError("Expected an array of meetings, but got something else.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch customer meetings.");
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    const filtered = meetings.filter((meeting) => {
      const searchFilter = currentFilters.search
        ? meeting.customername
            ?.toLowerCase()
            .includes(currentFilters.search.toLowerCase())
        : true;
      const startDateFilter = currentFilters.startDate
        ? new Date(meeting.startdate) >= new Date(currentFilters.startDate)
        : true;
      const endDateFilter = currentFilters.endDate
        ? new Date(meeting.enddate) <= new Date(currentFilters.endDate)
        : true;
      const startTimeFilter = currentFilters.startTime
        ? meeting.timestart >= currentFilters.startTime
        : true;
      const endTimeFilter = currentFilters.endTime
        ? meeting.timeend <= currentFilters.endTime
        : true;

      return (
        searchFilter &&
        startDateFilter &&
        endDateFilter &&
        startTimeFilter &&
        endTimeFilter
      );
    });

    setFilteredMeetings(filtered);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    });
    setFilteredMeetings(meetings);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const formatInputDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleModalChange = (e) => {
    setNewMeeting({ ...newMeeting, [e.target.name]: e.target.value });
  };

  const handleEditModalChange = (e) => {
    setEditMeeting({ ...editMeeting, [e.target.name]: e.target.value });
  };

  const handleAddMeeting = async () => {
    if (
      !newMeeting.customer_id ||
      !newMeeting.startdate ||
      !newMeeting.enddate ||
      !newMeeting.timestart ||
      !newMeeting.timeend
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const payload = {
        ...newMeeting,
        customer_id: parseInt(newMeeting.customer_id, 10),
      };

      const response = await axios.post(
        "http://localhost:8080/api/meetingcus",
        payload
      );
      if (response.data) {
        setMeetings([...meetings, response.data]);
        setFilteredMeetings([...filteredMeetings, response.data]);
        setShowAddModal(false);
        setNewMeeting({
          customer_id: "",
          startdate: "",
          enddate: "",
          timestart: "",
          timeend: "",
        });
      } else {
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Failed to add customer meeting:", error);
      alert("Error adding customer meeting. Please try again.");
    }
  };

  const handleEditMeeting = async () => {
    if (!editMeeting) {
      alert("Please select a meeting to edit.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/meetingcus/${editMeeting.meetingcus_id}`,
        editMeeting
      );

      if (response.status === 200 && response.data) {
        const updatedMeetings = meetings.map((meeting) =>
          meeting.meetingcus === editMeeting.meetingcus
            ? { ...meeting, ...response.data }
            : meeting
        );
        setMeetings(updatedMeetings);
        setFilteredMeetings(updatedMeetings);
        setShowEditModal(false);
        setEditMeeting(null);
      } else {
        alert("Unexpected response from the server. Please check your data.");
      }
    } catch (error) {
      console.error("Failed to edit customer meeting:", error);
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while editing the meeting.";
      alert(errorMessage);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (
      window.confirm("Are you sure you want to delete this customer meeting?")
    ) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/meetingcus/${meetingId}`
        );
        if (response.data) {
          const updatedMeetings = meetings.filter(
            (meeting) => meeting.meetingcus !== meetingId
          );
          setMeetings(updatedMeetings);
          setFilteredMeetings(updatedMeetings);
        } else {
          alert("Unexpected response from the server.");
        }
      } catch (error) {
        console.error("Failed to delete customer meeting:", error);
        alert("Error deleting customer meeting. Please try again.");
      }
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
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="search"
                placeholder="Search by customer name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={handleFilterChange}
              />
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

            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="time"
                name="startTime"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.startTime}
                onChange={handleFilterChange}
              />
            </div>

            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="time"
                name="endTime"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.endTime}
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
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Customer Meeting
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
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Date Range
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Time
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMeetings.map((meeting) => (
                  <tr
                    key={meeting.meetingcus}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {meeting.cus_company_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(meeting.startdate)} -{" "}
                      {formatDate(meeting.enddate)}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {meeting.timestart} - {meeting.timeend}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditMeeting(meeting);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteMeeting(meeting.meetingcus)
                          }
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6">
              New Customer Meeting
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer ID
                </label>
                <input
                  type="text"
                  name="customer_id"
                  placeholder="Enter customer ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newMeeting.customer_id}
                  onChange={handleModalChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startdate"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newMeeting.startdate}
                    onChange={handleModalChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="enddate"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newMeeting.enddate}
                    onChange={handleModalChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="timestart"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newMeeting.timestart}
                    onChange={handleModalChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="timeend"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newMeeting.timeend}
                    onChange={handleModalChange}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMeeting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Meeting Modal */}
      {showEditModal && editMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Edit Customer Meeting
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer ID
                </label>
                <input
                  type="text"
                  name="customer_id"
                  placeholder="Enter customer ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editMeeting.customer_id}
                  onChange={handleEditModalChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startdate"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formatInputDate(editMeeting.startdate)}
                    onChange={handleEditModalChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="enddate"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formatInputDate(editMeeting.enddate)}
                    onChange={handleEditModalChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="timestart"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editMeeting.timestart}
                    onChange={handleEditModalChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="timeend"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editMeeting.timeend}
                    onChange={handleEditModalChange}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditMeeting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCustomerMeeting;
