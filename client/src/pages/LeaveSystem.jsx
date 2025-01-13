import React, { useState } from "react";

const LeaveSystem = () => {
  // ตัวอย่างข้อมูลการลา
  const [leaves, setLeaves] = useState([
    {
      id: 1,
      employeeName: "Firstname Lastname",
      leaveType: "Sick Leave",
      startDate: "2024-02-18",
      endDate: "2024-02-19",
    },
    {
      id: 2,
      employeeName: "Firstname Lastname",
      leaveType: "Private Leave",
      startDate: "2024-02-18",
      endDate: "2024-02-19",
    },
    {
      id: 3,
      employeeName: "Firstname Lastname",
      leaveType: "Annual Leave",
      startDate: "2024-02-18",
      endDate: "2024-02-19",
    },
    {
      id: 4,
      employeeName: "Firstname Lastname",
      leaveType: "Annual Leave",
      startDate: "2024-02-18",
      endDate: "2024-02-19",
    },
  ]);

  // ฟังก์ชันตัวกรองค้นหา (ถ้าต้องการเพิ่ม)
  const [filters, setFilters] = useState({
    search: "",
    leaveType: "",
    startDate: "",
    endDate: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6  min-h-screen">
      {/* Search and Filters */}
      <div className="flex  gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search for Name"
          className="border border-gray-300 p-2 rounded w-full md:w-1/4"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select
        
          name="leaveType"
          className="border border-gray-300 p-2 rounded w-full md:w-1/4"
          value={filters.leaveType}
          onChange={handleFilterChange}
        >
          <option value="">Select a leave type</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Private Leave">Private Leave</option>
          <option value="Annual Leave">Annual Leave</option>
        </select>
        <div className="flex gap-2 w-full md:w-1/2">
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {/* Leave Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2">Employee name</th>
            <th className="border border-gray-300 p-2">Leave type</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td className="border border-gray-300 p-2">
                {leave.employeeName}
              </td>
              <td className="border border-gray-300 p-2">{leave.leaveType}</td>
              <td className="border border-gray-300 p-2">
                {leave.startDate} - {leave.endDate}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <button className="text-green-500 hover:underline mx-2">
                  ✔
                </button>
                <button className="text-red-500 hover:underline mx-2">
                  ✘
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveSystem;
