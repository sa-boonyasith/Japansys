import React, { useState, useEffect } from "react";
import axios from "axios";

const Meeting = () => {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/meeting");
        if (Array.isArray(response.data.listmeetingroom)) {
          setMeetings(response.data.listmeetingroom);
          setFilteredMeetings(response.data.listmeetingroom);
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
        ? meeting.firstname.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          meeting.lastname.toLowerCase().includes(currentFilters.search.toLowerCase())
        : true;
      const statusFilter = currentFilters.status ? meeting.status === currentFilters.status : true;
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
    setFilteredMeetings(filtered);
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
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, "-");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-200">
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
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
            <option value="pending">Pending</option>
            <option value="allowed">Allowed</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={resetFilters} className="bg-gray-500 text-white px-4 py-2 rounded">
            Reset
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border border-gray-300 p-2">Meeting room username</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Time</th>
            <th className="border border-gray-300 p-2">Status</th>
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
              <td className="border text-center border-gray-300 p-2">{meeting.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Meeting;
