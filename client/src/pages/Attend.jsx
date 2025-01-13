import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendList = () => {
  const [attend, setAttend] = useState([]);
  const [error, setError] = useState(null);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/attend'); // URL API
        setAttend(response.data); // เก็บข้อมูลใน state
      } catch (err) {
        setError('Failed to fetch attendance records');
        console.error(err);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Attendance Records</h1>
      {error && <div className="text-red-500">{error}</div>}
      {!error && attend.length === 0 && <div>Loading...</div>}
      {attend.length > 0 && (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Firstname</th>
              <th className="border border-gray-300 px-4 py-2">Lastname</th>
              <th className="border border-gray-300 px-4 py-2">Check In</th>
              <th className="border border-gray-300 px-4 py-2">Check Out</th>
              <th className="border border-gray-300 px-4 py-2">Working Hours</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {attend.map((attend) => (
              <tr key={attend.attend_id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{attend.attend_id}</td>
                <td className="border border-gray-300 px-4 py-2">{attend.firstname}</td>
                <td className="border border-gray-300 px-4 py-2">{attend.lastname}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(attend.check_in_time).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(attend.check_out_time).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{attend.working_hours || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">{attend.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendList;
