import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Meeting = () => {
  const [meeting, setMeeting] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/meeting');
        setMeeting(response.data.listmeetingroom || []); // กำหนดเป็นอาร์เรย์ในกรณีที่ไม่มีข้อมูล
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch meeting data');
        console.error(err);
        setLoading(false);
      }
    };

    fetchMeeting();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // เพิ่ม 0 ข้างหน้า ถ้าวันน้อยกว่า 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0, ต้องบวก 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // ตรวจสอบว่า meeting เป็นอาร์เรย์
  if (!Array.isArray(meeting)) {
    return <div>No meeting data available</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Meeting Room Reservations</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Meeting Name</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {meeting.length > 0 ? (
            meeting.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {item.firstname} {item.lastname}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatDate(item.startdate)} - {formatDate(item.enddate)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.timestart} - {item.timeend}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">
                No meetings available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Meeting;
