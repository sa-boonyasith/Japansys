import React, { useState } from "react";
import Sidebar from "../component/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";

const DashboardLayout = ({ user, onLogout, activeMenu, onToggleJobButtons }) => {
  // ตั้งค่าเริ่มต้นให้ปุ่มแรกของเมนู "Job" เป็น active
  const [activeButton, setActiveButton] = useState("สมัครงาน");
  const navigate = useNavigate()

  const handleButtonClick = (button) => {
    setActiveButton(button); // ตั้งค่า activeButton
    if (button === "สมัครงาน") {
      navigate("/dashboard/Job"); // เปลี่ยนไปยังเส้นทางย่อยของ Job
    } else if (button === "ทดลองงาน") {
      navigate("/dashboard/Job/trial"); // เปลี่ยนไปยังเส้นทางย่อยของ Job
    }
  };
  

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800">
        <Sidebar onLogout={onLogout} onToggleJobButtons={onToggleJobButtons} />
      </div>

      {/* Main Content */}
      <div className="bg-[#b3b2ae] pt-[70px] p-[60px] border-l border-gray-300 overflow-y-auto relative">
        {/* Header */}
        <div className="absolute top-4 right-[50px] bg-[#576F73] text-white px-4 py-2 border-[3px] border-white rounded-3xl shadow-lg">
          {user?.firstname} {user?.lastname}
        </div>

        {/* ปุ่มเมนู */}
        <div className="dashboard-container">
          {/* Render ปุ่มเฉพาะตามเมนูที่ active */}
          {activeMenu === "Job" && (
            <div className="job-buttons">
              <button
                className={`p-2 rounded-t-lg ${
                  activeButton === "สมัครงาน" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("สมัครงาน")}
              >
                สมัครงาน
              </button>
              <button
                className={`p-2 ml-2 rounded-t-lg ${
                  activeButton === "ทดลองงาน" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("ทดลองงาน")}
              >
                ทดลองงาน
              </button>
            </div>
          )}
          {activeMenu === "attend" && (
            <div className="attend-buttons">
              <button
                className={`p-2 rounded-t-lg ${
                  activeButton === "ลงเวลาเข้างาน" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("ลงเวลาเข้างาน")}
              >
                ลงเวลาเข้างาน
              </button>
              <button
                className={`p-2 ml-2 rounded-t-lg ${
                  activeButton === "ลงเวลางานเลิก" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("ลงเวลางานเลิก")}
              >
                ลงเวลางานเลิก
              </button>
            </div>
          )}
          {activeMenu === "todo-list" && (
            <div className="todo-list-buttons">
              <button
                className={`p-2 rounded-t-lg ${
                  activeButton === "งานโง่ๆ" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("งานโง่ๆ")}
              >
                งานโง่ๆ
              </button>
              <button
                className={`p-2 ml-2 rounded-t-lg ${
                  activeButton === "ไอสัส" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("ไอสัส")}
              >
                ไอสัส
              </button>
            </div>
          )}
          {activeMenu === "leave-system" && (
            <div className="list-system-buttons">
              <button
                className={`p-2 rounded-t-lg ${
                  activeButton === "ลา" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("ลา")}
              >
                ลา
              </button>
              <button
                className={`p-2 ml-2 rounded-t-lg ${
                  activeButton === "ก่อย" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("ก่อย")}
              >
                ก่อย
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="h-full p-4 bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
