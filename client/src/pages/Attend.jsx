import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Attend = () => {
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

  // ฟังก์ชันสำหรับเพิ่มข้อมูล (เช็คอิน)
  const handleAdd = async () => {
    try {
      const employeeId = prompt('Enter Employee ID:'); // รับ ID จากผู้ใช้
      if (!employeeId) {
        alert('Employee ID is required');
        return;
      }

      const response = await axios.post('http://localhost:8080/api/attend', {
        employee_id: parseInt(employeeId),
      });

      alert(response.data.message || 'Added successfully');

      // อัปเดตข้อมูลในตาราง
      setAttend((prevAttend) => [...prevAttend, response.data.newAttend]);
    } catch (err) {
      console.error('Failed to add attendance record', err);
      alert('Failed to add attendance record');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Attendance Records</h1>
      {error && <div className="text-red-500">{error}</div>}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleAdd}
      >
        Add Attendance
      </button>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Firstname</th>
            <th className="border border-gray-300 px-4 py-2">Lastname</th>
            <th className="border border-gray-300 px-4 py-2">Check In</th>
          </tr>
        </thead>
        <tbody>
          {attend.map((record) => (
            <tr key={record.attend_id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{record.attend_id}</td>
              <td className="border border-gray-300 px-4 py-2">{record.firstname}</td>
              <td className="border border-gray-300 px-4 py-2">{record.lastname}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(record.check_in_time).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attend;
