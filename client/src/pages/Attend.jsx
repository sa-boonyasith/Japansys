import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, UserCheck, Calendar, Users } from 'lucide-react';

const Attend = () => {
  const [attend, setAttend] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalToday: 0,
    totalEmployees: 0
  });

  useEffect(() => {
    // Timer for updating current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/attend');
        setAttend(response.data);
        
        // Calculate stats
        const today = new Date().toLocaleDateString();
        const todayCheckins = response.data.filter(record => 
          new Date(record.check_in_time).toLocaleDateString() === today
        ).length;
        
        setStats({
          totalToday: todayCheckins,
          totalEmployees: response.data.length
        });
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลการเช็คอินได้');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
    
    // Refresh data every minute
    const interval = setInterval(fetchAttendance, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = async () => {
    try {
      const employeeId = prompt('กรุณาใส่รหัสพนักงาน:');
      if (!employeeId) {
        alert('กรุณาใส่รหัสพนักงาน');
        return;
      }

      const response = await axios.post('http://localhost:8080/api/attend', {
        employee_id: parseInt(employeeId),
      });

      alert('เช็คอินสำเร็จ!');
      
      // Update attendance list with new record
      setAttend((prevAttend) => [response.data.newAttend, ...prevAttend]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalToday: prev.totalToday + 1
      }));
    } catch (err) {
      console.error('เช็คอินไม่สำเร็จ', err);
      alert('เช็คอินไม่สำเร็จ: ' + (err.response?.data?.message || err.message));
    }
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
          <h1 className="text-3xl font-bold text-gray-800">ระบบบันทึกเวลาทำงาน</h1>
          <p className="text-gray-600 mt-2">
            {currentTime.toLocaleDateString('th-TH', {
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
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">เวลาปัจจุบัน</p>
              <p className="text-xl font-semibold">
                {currentTime.toLocaleTimeString('th-TH')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">เช็คอินวันนี้</p>
              <p className="text-xl font-semibold">{stats.totalToday} คน</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">พนักงานทั้งหมด</p>
              <p className="text-xl font-semibold">{stats.totalEmployees} คน</p>
            </div>
          </div>
        </div>

        {/* Check-in Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center gap-2"
          >
            <UserCheck className="h-5 w-5" />
            เช็คอิน
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
            <h2 className="text-xl font-semibold text-gray-800">ประวัติการเช็คอิน</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จำนวนพนักงาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    นามสกุล
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เวลาเช็คอิน
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attend.map((record) => (
                  <tr key={record.attend_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {record.attend_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {record.firstname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {record.lastname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {new Date(record.check_in_time).toLocaleString('th-TH')}
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

export default Attend;