import React, { useState } from "react";

const Meeting = () => {
  const [meetingData, setMeetingData] = useState([
    {
      name: "Firstname Lastname",
      startDate: "2024-02-18",
      endDate: "2024-02-18",
      time: "16:00 - 17:00",
    },
    {
      name: "Firstname Lastname",
      startDate: "2024-02-19",
      endDate: "2024-02-19",
      time: "16:00 - 17:00",
    },
    {
      name: "Firstname Lastname",
      startDate: "2024-02-20",
      endDate: "2024-02-20",
      time: "16:00 - 17:00",
    },
    {
      name: "Firstname Lastname",
      startDate: "2024-02-21",
      endDate: "2024-02-21",
      time: "16:00 - 17:00",
    },
  ]);

  const handleEdit = (index) => {
    alert(`Edit functionality for row ${index + 1}`);
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this meeting?`
    );
    if (confirmDelete) {
      const updatedData = meetingData.filter((_, i) => i !== index);
      setMeetingData(updatedData);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Meeting Room Schedule</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Meeting room username</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Time</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {meetingData.map((meeting, index) => (
            <tr key={index} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{meeting.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {meeting.startDate} - {meeting.endDate}
              </td>
              <td className="border border-gray-300 px-4 py-2">{meeting.time}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Meeting;
