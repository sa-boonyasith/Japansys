import React, { useState, useEffect } from "react";
import axios from "axios";

const Test = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null); // state สำหรับเก็บข้อมูลผู้สมัครที่เลือก
  const [isModalOpen, setIsModalOpen] = useState(false); // state สำหรับเปิด/ปิด modal

  // ดึงข้อมูลจาก API
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/jobaplication") // ตรวจสอบ URL ของ API
      .then((response) => {
        setApplications(response.data.listjobaplication); // ตั้งค่า state ด้วยข้อมูลที่ได้จาก backend
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []);

  // ฟังก์ชันสำหรับแก้ไขสถานะ
  const handleEditStatus = (id, newStatus) => {
    axios
      .put(`http://localhost:8080/api/jobaplication/${id}`, { status: newStatus })
      .then(() => {
        // ดึงข้อมูลใหม่
        return axios.get("http://localhost:8080/api/jobaplication");
      })
      .then((response) => {
        setApplications(response.data.listjobaplication);
      })
      .catch((error) => {
        console.error("Error updating or fetching applications:", error);
        alert("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
      });
  };
  

  // ฟังก์ชันสำหรับลบข้อมูล
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/jobaplication/${id}`)
      .then(() => {
        setApplications((prev) => prev.filter((app) => app.job_id !== id));
      })
      .catch((error) => {
        console.error("Error deleting application:", error);
      });
  };

  // ฟังก์ชันกรองข้อมูลตามสถานะ
  const filterByStatus = (status) =>
    applications.filter((app) => app.status === status);

  // ฟังก์ชันสำหรับแสดงข้อมูลผู้สมัคร
  const handleViewDetails = (app) => {
    setSelectedApplication(app); // ตั้งค่า state ด้วยข้อมูลของผู้สมัครที่เลือก
    setIsModalOpen(true); // เปิด modal
  };

  // ฟังก์ชันสำหรับปิด modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // ปิด modal
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">ระบบจัดการผู้สมัครงาน</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["new", "wait", "pass"].map((status) => (
          <div key={status} className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              {status === "new" && "ผู้สมัครใหม่"}
              {status === "wait" && "รอสัมภาษณ์"}
              {status === "pass" && "ผ่านสัมภาษณ์"}
            </h2>
            <ul>
              {filterByStatus(status).map((app) => (
                <li
                  key={app.job_id}
                  className="flex items-center justify-between mb-2"
                >
                  <div>
                    <p
                      className="font-medium cursor-pointer text-blue-500"
                      onClick={() => handleViewDetails(app)} // คลิกเพื่อดูข้อมูล
                    >
                      {app.firstname} {app.lastname}
                    </p>
                    <p className="text-sm text-gray-600">
                      ตำแหน่ง: {app.job_position}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {/* ปุ่มแก้ไขสถานะ */}
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleEditStatus(app.job_id, e.target.value)
                      }
                      className="p-1 text-sm border rounded-md"
                    >
                      <option value="new">ใหม่</option>
                      <option value="wait">รอสัมภาษณ์</option>
                      <option value="pass">ผ่านสัมภาษณ์</option>
                    </select>
                    {/* ปุ่มลบ */}
                    <button
                      onClick={() => handleDelete(app.job_id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                    >
                      ลบ
                    </button>
                  </div>
                </li>
              ))}
              {filterByStatus(status).length === 0 && (
                <p className="text-sm text-gray-500">ไม่มีข้อมูล</p>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Modal Popup สำหรับแสดงข้อมูลผู้สมัคร */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">รายละเอียดผู้สมัคร</h3>
            <p>
              <strong>ชื่อ:</strong> {selectedApplication.firstname}{" "}
              {selectedApplication.lastname}
            </p>
            <p>
              <strong>ตำแหน่งที่สมัคร:</strong>{" "}
              {selectedApplication.job_position}
            </p>
            <p>
              <strong>อายุ:</strong> {selectedApplication.age} ปี
            </p>
            <p>
              <strong>อีเมล:</strong> {selectedApplication.email}
            </p>
            <p>
              <strong>สถานะ:</strong>{" "}
              {selectedApplication.status === "new"
                ? "ผู้สมัครใหม่"
                : selectedApplication.status === "wait"
                ? "รอสัมภาษณ์"
                : "ผ่านสัมภาษณ์"}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
