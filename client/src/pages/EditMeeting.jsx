import React, { useState, useEffect } from "react";
import axios from "axios";

const Editmeeting = () => {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const [newMeeting, setNewMeeting] = useState({
    employee_id: "",
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

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/meeting");
        if (Array.isArray(response.data.listmeetingroom)) {
          const today = new Date();
          const sortedMeetings = response.data.listmeetingroom.sort((a, b) => {
            const diffA = Math.abs(new Date(a.startdate) - today);
            const diffB = Math.abs(new Date(b.startdate) - today);
            return diffA - diffB;
          });
          setMeetings(sortedMeetings);
          setFilteredMeetings(sortedMeetings);
        } else {
          setError("Expected an array of meetings, but got something else.");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
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
        ? meeting.firstname
            .toLowerCase()
            .includes(currentFilters.search.toLowerCase()) ||
          meeting.lastname
            .toLowerCase()
            .includes(currentFilters.search.toLowerCase())
        : true;
      const statusFilter = currentFilters.status
        ? meeting.status === currentFilters.status
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
        statusFilter &&
        startDateFilter &&
        endDateFilter &&
        startTimeFilter &&
        endTimeFilter
      );
    });

    const sorted = filtered.sort((a, b) => {
      const today = new Date();
      const diffA = Math.abs(new Date(a.startdate) - today);
      const diffB = Math.abs(new Date(b.startdate) - today);
      return diffA - diffB;
    });

    setFilteredMeetings(sorted);
  };

  const resetFilters = () => {
    const initialFilters = {
      search: "",
      status: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    };
    setFilters(initialFilters);
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

  const handleEditModalChange = (e) => {  // For edit modal
    setEditMeeting({ ...editMeeting, [e.target.name]: e.target.value });
  };

  const handleAddMeeting = async () => {
    if (
      !newMeeting.employee_id ||
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
        employee_id: parseInt(newMeeting.employee_id, 10),
      };

      const response = await axios.post(
        "http://localhost:8080/api/meeting",
        payload
      );
      if (response.data && response.data.newmeetingroom) {
        setMeetings([...meetings, response.data.newmeetingroom]);
        setFilteredMeetings([
          ...filteredMeetings,
          response.data.newmeetingroom,
        ]);
        setShowAddModal(false);
        setNewMeeting({
          employee_id: "",
          startdate: "",
          enddate: "",
          timestart: "",
          timeend: "",
        });
      } else {
        const serverMessage =
        response.data && response.data.message
          ? response.data.message
          : "Unexpected response from the server.";
      alert(serverMessage); // แสดงข้อความจาก response หากมี
        
      }
    } catch (error) {
      console.error("Failed to add meeting:", error);
      alert("Error adding meeting. Please try again.");
    }
  };
  const handleEditMeeting = async () => {
    if (!editMeeting) {
      alert("Please select a meeting to edit.");
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8080/api/meeting/${editMeeting.meeting_id}`,
        editMeeting
      );
  
      if (response.status === 200 && response.data?.update) {
        const updatedMeetings = meetings.map((meeting) =>
          meeting.meeting_id === editMeeting.meeting_id
            ? { ...meeting, ...response.data.update }
            : meeting
        );
  
        // Update state with new meeting data
        setMeetings(updatedMeetings);
        setFilteredMeetings(updatedMeetings);
  
        // Reset UI states after successful edit
        setShowEditModal(false);
        setEditMeeting(null);
      } else {
        alert("Unexpected response from the server. Please check your data.");
      }
    } catch (error) {
      console.error("Failed to edit meeting:", error);
  
      // Show appropriate error feedback
      const errorMessage =
        error.response?.data?.error || "An error occurred while editing the meeting. Please try again.";
      alert(errorMessage);
    }
  };
  
  const handleDeleteMeeting = async (meetingId) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/meeting/${meetingId}`
        );
        if (response.data && response.data.deleted) {
          const updatedMeetings = meetings.filter(
            (meeting) => meeting.meeting_id !== meetingId
          );
          setMeetings(updatedMeetings);
          setFilteredMeetings(updatedMeetings);
        } else {
          alert("Unexpected response from the server.");
        }
      } catch (error) {
        console.error("Failed to delete meeting:", error);
        alert("Error deleting meeting. Please try again.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="shadow-lg p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search for Name"
            className="border border-gray-300 p-2 rounded w-full md:w-1/5"
            value={filters.search}
            onChange={handleFilterChange}
          />
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
          <div className="flex gap-2 w-full md:w-2/5">
            <input
              type="time"
              name="startTime"
              className="border text-gray-400 border-gray-300 p-2 rounded flex-1"
              value={filters.startTime}
              onChange={handleFilterChange}
            />
            <input
              type="time"
              name="endTime"
              className="border text-gray-400 border-gray-300 p-2 rounded flex-1"
              value={filters.endTime}
              onChange={handleFilterChange}
            />
          </div>
          <select
            name="status"
            className="border text-gray-400 border-gray-300 p-2 rounded w-full md:w-1/5"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Allowed">Allowed</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white  px-4 py-2 rounded"
          >
            Add Meeting
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border border-gray-300 p-2">
              Meeting room username
            </th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Time</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMeetings.map((meeting) => (
            <tr key={meeting.meeting_id}>
              <td className="border text-center border-gray-300 p-2">
                {meeting.firstname} {meeting.lastname}
              </td>
              <td className="border text-center border-gray-300 p-2">
                {formatDate(meeting.startdate)} - {formatDate(meeting.enddate)}
              </td>
              <td className="border text-center border-gray-300 p-2">
                {meeting.timestart} - {meeting.timeend}
              </td>
              <td className="border text-center border-gray-300 p-2">
                {meeting.status}
              </td>
              <td className="border border-gray-300 p-2 text-center">
              <button
                  onClick={() => { setEditMeeting(meeting); setShowEditModal(true); }}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMeeting(meeting.meeting_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Meeting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Add Meeting</h2>
            <input
              type="text"
              name="employee_id"
              placeholder="Employee ID"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newMeeting.employee_id}
              onChange={handleModalChange}
            />
            <input
              type="date"
              name="startdate"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newMeeting.startdate}
              onChange={handleModalChange}
            />
            <input
              type="date"
              name="enddate"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newMeeting.enddate}
              onChange={handleModalChange}
            />
            <input
              type="time"
              name="timestart"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newMeeting.timestart}
              onChange={handleModalChange}
            />
            <input
              type="time"
              name="timeend"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newMeeting.timeend}
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
                onClick={handleAddMeeting}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
       {/* Edit Meeting Modal */}
       {showEditModal && editMeeting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Edit Meeting</h2>
            <input
              type="text"
              name="employee_id"
              placeholder="Employee ID"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={editMeeting.employee_id}
              onChange={handleEditModalChange}
            />
            <input
              type="date"
              name="startdate"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={formatInputDate(editMeeting.startdate)}
              onChange={handleEditModalChange}
            />
            <input
              type="date"
              name="enddate"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={formatInputDate(editMeeting.enddate)}
              onChange={handleEditModalChange}
            />
            <input
              type="time"
              name="timestart"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={editMeeting.timestart}
              onChange={handleEditModalChange}
            />
            <input
              type="time"
              name="timeend"
              className="border border-gray-300 p-2 rounded w-full mb-4"
              value={editMeeting.timeend}
              onChange={handleEditModalChange}
            />
            <select
            name="status"
            className="border  border-gray-300 p-2 rounded w-full mb-4"
            value={editMeeting.status}
            onChange={handleEditModalChange}
          >
            <option value="Pending">Pending</option>
            <option value="Allowed">Allowed</option>
            <option value="Rejected">Rejected</option>
          </select>
            <div className="flex justify-end">
              <button
                onClick={handleEditMeeting}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editmeeting;
