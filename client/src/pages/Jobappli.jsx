import React, { useState, useEffect } from "react";
import axios from "axios";

const Job2 = () => {
  const [applications, setApplications] = useState([]);
  const [editingApp, setEditingApp] = useState(null); // เก็บข้อมูลผู้สมัครที่กำลังแก้ไข
  const [formData, setFormData] = useState({}); // เก็บข้อมูลในฟอร์ม

  // ฟังก์ชันดึงข้อมูล
  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/jobaplication");
      setApplications(response.data.listjobaplication);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // เปิดฟอร์มแก้ไข
  const handleEdit = (app) => {
    setEditingApp(app.job_id);
    setFormData({ ...app }); // ก๊อปปี้ข้อมูลเดิมมาเพื่อแก้ไข
  };

  // บันทึกข้อมูลที่แก้ไข
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8080/api/jobaplication/${editingApp}`, formData);
      alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว");
      fetchApplications(); // รีเฟรชข้อมูล
      setEditingApp(null); // ปิดโหมดแก้ไข
    } catch (error) {
      console.error("Error saving application:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // อัปเดตค่าฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Job Applications</h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-gray-600 font-semibold">ชื่อ</th>
              <th className="border px-4 py-2 text-gray-600 font-semibold">ตำแหน่ง</th>
              <th className="border px-4 py-2 text-gray-600 font-semibold">สถานะ</th>
              <th className="border px-4 py-2 text-gray-600 font-semibold">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.job_id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-gray-700">
                  {app.firstname} {app.lastname}
                </td>
                <td className="border px-4 py-2 text-gray-700">{app.job_position}</td>
                <td className="border px-4 py-2 text-gray-700">{app.status}</td>
                <td className="border px-4 py-2 text-center">
                  {editingApp === app.job_id ? (
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 shadow-sm"
                    >
                      บันทึก
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(app)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-sm"
                    >
                      แก้ไข
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingApp && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">แก้ไขข้อมูลผู้สมัคร</h2>
          <form className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700">ชื่อ:</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">นามสกุล:</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">สถานะ:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="new">ผู้สมัครใหม่</option>
                <option value="wait">รอสัมภาษณ์</option>
                <option value="pass">ผ่านสัมภาษณ์</option>
                <option value="reject">ปฏิเสธ</option>
              </select>
            </div>
            <button
              onClick={handleSave}
              type="button"
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              บันทึก
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Job2;
