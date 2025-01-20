import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Bubble = ({ data, setFilteredData, onAdd, placeholder = "Search..." }) => {
  const [filters, setFilters] = useState({
    name: "",
    startDate: null,
    endDate: null,
  });

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, date) => {
    setFilters({ ...filters, [name]: date });
  };

  useEffect(() => {
    if (data && setFilteredData) {
      const filtered = data.filter((item) => {
        const matchesName = filters.name
          ? Object.values(item)
              .join(" ")
              .toLowerCase()
              .includes(filters.name.toLowerCase())
          : true;
        const matchesStartDate = filters.startDate
          ? new Date(item.startdate) >= new Date(filters.startDate)
          : true;
        const matchesEndDate = filters.endDate
          ? new Date(item.enddate) <= new Date(filters.endDate)
          : true;

        return matchesName && matchesStartDate && matchesEndDate;
      });

      setFilteredData(filtered);
    }
  }, [filters, data, setFilteredData]);

  const handleAddClick = () => {
    if (onAdd) {
      const newEntry = {
        firstname: filters.name || "Unnamed",
        lastname: "",
        startdate: filters.startDate
          ? filters.startDate.toISOString().split("T")[0]
          : "",
        enddate: filters.endDate
          ? filters.endDate.toISOString().split("T")[0]
          : "",
      };
      onAdd(newEntry);
    }
    setFilters({ name: "", startDate: null, endDate: null });
  };

  const handleResetClick = () => {
    setFilters({ name: "", startDate: null, endDate: null });
    if (data && setFilteredData) {
      setFilteredData(data);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
      <div className="flex flex-1 w-full md:w-auto">
        <input
          type="text"
          name="name"
          placeholder={placeholder}
          value={filters.name}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      <div className="flex space-x-2 items-center w-full md:w-auto">
        <DatePicker
          selected={filters.startDate}
          onChange={(date) => handleDateChange("startDate", date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Start Date"
          className="border border-gray-300 p-2 rounded"
        />
        <span>to</span>
        <DatePicker
          selected={filters.endDate}
          onChange={(date) => handleDateChange("endDate", date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="End Date"
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      <div className="flex space-x-2">
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
