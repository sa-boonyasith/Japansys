import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Bubble = ({ setFilteredData, onAdd }) => {
  const [meetingDetails, setMeetingDetails] = useState({
    name: "",
    startDate: null,
    endDate: null,
  });

  // Handle input change
  const handleInputChange = (e) => {
    setMeetingDetails({ ...meetingDetails, [e.target.name]: e.target.value });
  };

  // Handle date picker change
  const handleDateChange = (name, date) => {
    setMeetingDetails({ ...meetingDetails, [name]: date });
  };

  // Automatically filter data when meetingDetails changes
  useEffect(() => {
    if (setFilteredData) {
      setFilteredData((prevData) => {
        return prevData.filter((item) => {
          const matchesName = meetingDetails.name
            ? item.name.toLowerCase().includes(meetingDetails.name.toLowerCase())
            : true;
          const matchesStartDate = meetingDetails.startDate
            ? new Date(item.startDate) >= new Date(meetingDetails.startDate)
            : true;
          const matchesEndDate = meetingDetails.endDate
            ? new Date(item.endDate) <= new Date(meetingDetails.endDate)
            : true;

          return matchesName && matchesStartDate && matchesEndDate;
        });
      });
    }
  }, [meetingDetails, setFilteredData]);

  // Handle add click
  const handleAddClick = () => {
    if (onAdd) {
      const newEntry = {
        name: meetingDetails.name || "Unnamed",
        startDate: meetingDetails.startDate
          ? meetingDetails.startDate.toISOString().split("T")[0]
          : "",
        endDate: meetingDetails.endDate
          ? meetingDetails.endDate.toISOString().split("T")[0]
          : "",
      };
      onAdd(newEntry); // Pass the new entry to the parent
    }
    setMeetingDetails({ name: "", startDate: null, endDate: null }); // Reset form
  };

  // Handle reset click
  const handleResetClick = () => {
    setMeetingDetails({ name: "", startDate: null, endDate: null });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded flex items-center justify-between space-x-4">
      {/* Search Input */}
      <div className="flex items-center flex-1">
        <input
          type="text"
          name="name"
          placeholder="Search for Name or Place"
          value={meetingDetails.name}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      {/* Date Range Pickers */}
      <div className="flex items-center space-x-2">
        <DatePicker
          selected={meetingDetails.startDate}
          onChange={(date) => handleDateChange("startDate", date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Start Date"
          className="border border-gray-300 p-2 rounded"
        />
        <span>--</span>
        <DatePicker
          selected={meetingDetails.endDate}
          onChange={(date) => handleDateChange("endDate", date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="End Date"
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddClick}
        >
          Add
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={handleResetClick}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Bubble;
