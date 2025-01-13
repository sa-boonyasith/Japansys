import React, { useEffect, useState } from "react";
import axios from "axios";

const Checkout = () => {
  const [attend, setAttend] = useState([]);
  const [error, setError] = useState(null);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/attend"); // URL API
        setAttend(response.data); // เก็บข้อมูลใน state
      } catch (err) {
        setError("Failed to fetch attendance records");
        console.error(err);
      }
    };

    fetchAttendance();
  }, []);

  const handlecheckout = async () => {
    try {
      const employeeId = prompt("Enter Employee ID:"); // รับ ID จากผู้ใช้
      if (!employeeId) {
        alert("Employee ID is required");
        return;
      }
  
      const response = await axios.put("http://localhost:8080/api/attend", {
        employee_id: parseInt(employeeId),
      });
  
      alert(response.data.message || "Checkout successfully");
  
      // อัปเดตข้อมูลในตารางด้วยการเรียก API ใหม่
      const updatedAttendance = await axios.get("http://localhost:8080/api/attend");
      setAttend(updatedAttendance.data);
    } catch (err) {
      console.error("Failed to checkout", err);
      alert(err.response?.data?.error || "Failed to checkout");
    }
  };
  

  return (
    <div className="p-4">
        <h1 className="text-xl font-semibold">Attendance Records</h1>
      {error && <div className="text-red-500">{error}</div>}
      <button
          onClick={handlecheckout}
          className="bg-blue-500 mt-2 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Checkout
        </button>
      {!error && attend.length === 0 && <div>Loading...</div>}
      {attend.length > 0 && (
        <table className="table-auto w-full mt-4  border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Firstname</th>
              <th className="border border-gray-300 px-4 py-2">Lastname</th>
              <th className="border border-gray-300 px-4 py-2">Check Out</th>
              <th className="border border-gray-300 px-4 py-2">Working Hours</th>
            </tr>
          </thead>
          <tbody>
            {attend.map((att) => (
              <tr key={att.attend_id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {att.attend_id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {att.firstname}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {att.lastname}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {att.check_out_time
                    ? new Date(att.check_out_time).toLocaleString()
                    : "Not Checked Out"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {att.working_hours || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Checkout;
