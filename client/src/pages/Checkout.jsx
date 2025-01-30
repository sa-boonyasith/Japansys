import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, LogOut, Calendar, Timer } from 'lucide-react';

const Checkout = () => {
  const [attend, setAttend] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCheckedOut: 0,
    averageHours: 0,
    remainingCheckouts: 0
  });

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/attend");
      setAttend(response.data);
      
      // Calculate stats
      const today = new Date().toLocaleDateString();
      const todayRecords = response.data.filter(record => 
        new Date(record.check_in_time).toLocaleDateString() === today
      );
      
      const checkedOut = todayRecords.filter(record => record.check_out_time).length;
      const totalHours = todayRecords.reduce((sum, record) => sum + (record.working_hours || 0), 0);
      
      setStats({
        totalCheckedOut: checkedOut,
        averageHours: checkedOut ? (totalHours / checkedOut) : 0,
        remainingCheckouts: todayRecords.length - checkedOut
      });
    } catch (err) {
      setError("ไม่สามารถดึงข้อมูลการเช็คเอาท์ได้");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckout = async () => {
    try {
      const employeeId = prompt("กรุณาใส่รหัสพนักงาน:");
      if (!employeeId) {
        alert("กรุณาใส่รหัสพนักงาน");
        return;
      }

      const response = await axios.put("http://localhost:8080/api/attend", {
        employee_id: parseInt(employeeId),
      });

      alert("เช็คเอาท์สำเร็จ!");
      fetchAttendance();
    } catch (err) {
      console.error("เช็คเอาท์ไม่สำเร็จ", err);
      alert(err.response?.data?.error || "เช็คเอาท์ไม่สำเร็จ");
    }
  };

  const formatHoursAndMinutes = (hours) => {
    if (!hours) return "0:00";
    const totalMinutes = Math.floor(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">ระบบบันทึกเวลาออกงาน</h1>
          <p className="text-gray-600 mt-2">
            {new Date().toLocaleDateString('th-TH', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <LogOut className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">เช็คเอาท์แล้ว</p>
              <p className="text-xl font-semibold">{stats.totalCheckedOut} คน</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Timer className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">เวลาทำงานเฉลี่ย</p>
              <p className="text-xl font-semibold">{formatHoursAndMinutes(stats.averageHours)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-orange-100 p-3 mr-4">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">รอเช็คเอาท์</p>
              <p className="text-xl font-semibold">{stats.remainingCheckouts} คน</p>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleCheckout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            เช็คเอาท์
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">ประวัติการเช็คเอาท์</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ไอดีพนักงาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    นามสกุล
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เวลาเช็คเอาท์
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชั่วโมงทำงาน
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attend.map((record) => (
                  <tr key={record.attend_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {record.employee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {record.firstname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {record.lastname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {record.check_out_time 
                        ? new Date(record.check_out_time).toLocaleString('th-TH')
                        : "ยังไม่เช็คเอาท์"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {record.working_hours
                        ? formatHoursAndMinutes(record.working_hours)
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;