import React, { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Bubble from "./Bubble";

const DashboardLayout = ({
  user,
  onLogout,
  activeMenu,
  onToggleJobButtons,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ตั้งค่า activeButton เริ่มต้นตามเส้นทางปัจจุบัน
  const [activeButton, setActiveButton] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [carBookings, setCarBookings] = useState([]);
  const [filteredCarBookings, setFilteredCarBookings] = useState([]);

  useEffect(() => {
    // ตรวจสอบ `pathname` แล้วตั้งค่า `activeButton`
    const menuMapping = {
      "/dashboard/Job": "สมัครงาน",
      "/dashboard/trial": "ทดลองงาน",
      "/dashboard/attend": "เวลาเข้า",
      "/dashboard/checkout": "เวลาออก",
      "/dashboard/todo-list": "todo",
      "/dashboard/progress": "progress",
      "/dashboard/leave-system": "leave-system",
      "/dashboard/leave-status": "leave-status",
      "/dashboard/meeting": "meeting",
      "/dashboard/car-booking": "car-booking",
    };

    const currentPath = Object.keys(menuMapping).find((key) =>
      location.pathname.includes(key)
    );

    setActiveButton(menuMapping[currentPath] || "");
  }, [location.pathname]);

  useEffect(() => {
    if (activeMenu === "meeting") {
      fetch("http://localhost:8080/api/meeting")
        .then((res) => res.json())
        .then((data) => {
          setMeetings(data.listmeetingroom || []);
          setFilteredMeetings(data.listmeetingroom || []);
        })
        .catch((err) => console.error("Error fetching meetings:", err));
    }

    if (activeMenu === "car-booking") {
      fetch("http://localhost:8080/api/car-booking")
        .then((res) => res.json())
        .then((data) => {
          setCarBookings(data.listcarbooking || []);
          setFilteredCarBookings(data.listcarbooking || []);
        })
        .catch((err) => console.error("Error fetching car bookings:", err));
    }
  }, [activeMenu]);

  const handleButtonClick = (button) => {
    setActiveButton(button);

    const buttonMapping = {
      สมัครงาน: "/dashboard/Job",
      ทดลองงาน: "/dashboard/trial",
      เวลาเข้า: "/dashboard/attend",
      เวลาออก: "/dashboard/checkout",
      todo: "/dashboard/todo-list",
      progress: "/dashboard/progress",
      "leave-system": "/dashboard/leave-system",
      "leave-status": "/dashboard/leave-status",
      meeting: "/dashboard/meeting",
      carbooking: "/dashboard/car-booking",
    };

    navigate(buttonMapping[button] || "/dashboard");
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
                  activeButton === "เวลาเข้า" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("เวลาเข้า")}
              >
                เวลาเข้า
              </button>
              <button
                className={`p-2 ml-2 rounded-t-lg ${
                  activeButton === "เวลาออก" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("เวลาออก")}
              >
                เวลาออก
              </button>
            </div>
          )}
          {activeMenu === "todo-list" && (
            <div className="todo-buttons">
              <button
                className={`p-2 rounded-t-lg ${
                  activeButton === "todo" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("todo")}
              >
                โปรเจ็ค
              </button>
              <button
                className={`p-2 ml-2 rounded-t-lg ${
                  activeButton === "progress" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("progress")}
              >
                ความคืบหน้า
              </button>
            </div>
          )}
          {activeMenu === "leave-system" && (
            <div className="leave-buttons">
              <button
                className={`p-2 rounded-t-lg ${
                  activeButton === "leave-system" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("leave-system")}
              >
                รายชื่อการลา
              </button>
              <button
                className={`p-2 ml-2 rounded-t-lg ${
                  activeButton === "leave-status" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("leave-status")}
              >
                สถานะการลา
              </button>
            </div>
          )}
          {/* {activeMenu === "meeting" && (
            <div className="mb-4">
              <Bubble
                data={meetings}
                setFilteredData={setFilteredMeetings}
                onAdd={handleAddMeeting}
              />
            </div>
          )} */}
          {/* {activeMenu === "car-booking" && (
            <div className="mb-4">
              <Bubble
                data={carBookings}
                setFilteredData={setFilteredCarBookings}
                onAdd={handleAddCarBooking}
              />
            </div>
          )} */}
        </div>

        {/* Content Area */}
        <div className="h-full p-2 bg-white overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
