import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Bubble = ({ setFilteredData }) => {
  const [meetingDetails, setMeetingDetails] = useState({
    name: "",
    startDate: null,
    endDate: null,
  });

  const [meetingData, setMeetingData] = useState([
    {
      name: "Firstname Lastname",
      startDate: "2024-02-18",
      endDate: "2024-02-18",
      time: "16:00 - 17:00",
      place: "Place Name",
      car: "No.1",
    },
    {
      name: "Firstname Lastname",
      startDate: "2024-02-19",
      endDate: "2024-02-19",
      time: "16:00 - 17:00",
      place: "Place Name",
      car: "No.2",
    },
  ]);

  const handleInputChange = (e) => {
    setMeetingDetails({ ...meetingDetails, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, date) => {
    setMeetingDetails({ ...meetingDetails, [name]: date });
  };

  const handleAddClick = () => {
    const newMeeting = {
      name: meetingDetails.name || "Unnamed",
      startDate: meetingDetails.startDate
        ? meetingDetails.startDate.toISOString().split("T")[0]
        : "",
      endDate: meetingDetails.endDate
        ? meetingDetails.endDate.toISOString().split("T")[0]
        : "",
      time: "16:00 - 17:00",
      place: "Default Place",
      car: "No.1",
    };

    const updatedData = [...meetingData, newMeeting];
    setMeetingData(updatedData);
    setFilteredData(updatedData); // อัปเดตข้อมูลในตารางหลัก
    setMeetingDetails({ name: "", startDate: null, endDate: null }); // รีเซ็ตฟอร์ม
  };

  const handleSearchClick = () => {
    const { name, startDate, endDate } = meetingDetails;

    const filtered = meetingData.filter((item) => {
      const matchesName = name
        ? item.name.toLowerCase().includes(name.toLowerCase())
        : true;
      const matchesStartDate = startDate
        ? new Date(item.startDate) >= new Date(startDate)
        : true;
      const matchesEndDate = endDate
        ? new Date(item.endDate) <= new Date(endDate)
        : true;

      return matchesName && matchesStartDate && matchesEndDate;
    });

    setFilteredData(filtered); // อัปเดตข้อมูลที่กรองแล้วให้ตาราง
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Bubble;
