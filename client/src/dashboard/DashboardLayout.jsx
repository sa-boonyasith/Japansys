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

  const [activeButton, setActiveButton] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [carBookings, setCarBookings] = useState([]);
  const [filteredCarBookings, setFilteredCarBookings] = useState([]);

  useEffect(() => {
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
      "/dashboard/editcar": "editcar",
      "/dashboard/editmeeting": "editmeeting",
      "/dashboard/expense-system": "expense-system",
      "/dashboard/editexpense": "editexpense",
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
    if (user?.role === "employee") {
      const restrictedButtons = [
        "ทดลองงาน",
        "leave-status",
        "editmeeting",
        "editcar",
        "editexpense",
      ];

      if (restrictedButtons.includes(button)) {
        alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        return;
      }
    }

    // Check if user role is "recruit" and trying to access restricted buttons
    else if (user?.role === "recruit") {
      const restrictedButtons = ["ทดลองงาน"];

      if (restrictedButtons.includes(button)) {
        alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        return;
      }
    }

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
      editcar: "/dashboard/editcar",
      editmeeting: "/dashboard/editmeeting",
      editexpense: "/dashboard/editexpense",
      "expense-system": "/dashboard/expense-system",
    };

    navigate(buttonMapping[button] || "/dashboard");
  };

  // Function to check if button should be disabled
  const isButtonDisabled = (buttonName) => {
    if (user?.role === "employee") {
      const restrictedButtons = [
        "ทดลองงาน",
        "leave-status",
        "editmeeting",
        "editcar",
        "editexpense",
      ];
      return restrictedButtons.includes(buttonName);
    } else if (user?.role === "recruit") {
      const restrictedButtons = ["ทดลองงาน"];
      return restrictedButtons.includes(buttonName);
    }
    return false;
  };

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen">
      <div className="bg-gray-800">
        <Sidebar onLogout={onLogout} onToggleJobButtons={onToggleJobButtons} />
      </div>

      <div className="bg-[#b3b2ae] pt-[70px] p-[60px] border-l border-gray-300 overflow-y-auto relative">
        <div className="absolute top-4 right-[50px] bg-[#576F73] text-white px-4 py-2 border-[3px] border-white rounded-3xl shadow-lg">
          {user?.firstname} {user?.lastname}
        </div>

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
                } ${
                  isButtonDisabled("ทดลองงาน")
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleButtonClick("ทดลองงาน")}
                disabled={isButtonDisabled("ทดลองงาน")}
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
                } ${
                  isButtonDisabled("เวลาออก")
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleButtonClick("เวลาออก")}
                disabled={isButtonDisabled("เวลาออก")}
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
                } ${
                  isButtonDisabled("progress")
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleButtonClick("progress")}
                disabled={isButtonDisabled("progress")}
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
              {/* <button
                className={`p-2 ml-2 rounded-t-lg ${
                  activeButton === "leave-status" ? "bg-white" : "bg-gray-300"
                } ${
                  isButtonDisabled("leave-status")
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleButtonClick("leave-status")}
                disabled={isButtonDisabled("leave-status")}
              >
                สถานะการลา
              </button> */}
            </div>
          )}
          {activeMenu === "meeting" && (
            <div className="">
              <button
                className={`p-2 rounded-t-lg ${
                  activeButton === "meeting" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("meeting")}
              >
                รายชื่อการนัดประชุม
              </button>
              {/* <button
                className={`p-2 ml-2 rounded-t-lg ${
                  activeButton === "editmeeting" ? "bg-white" : "bg-gray-300"
                } ${
                  isButtonDisabled("editmeeting")
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleButtonClick("editmeeting")}
                disabled={isButtonDisabled("editmeeting")}
              >
                สถานะการยืนยันคำขอ
              </button> */}
            </div>
          )}
          {activeMenu === "car-booking" && (
            <div className="">
              <button
                className={`p-2 rounded-t-lg ${
                  activeButton === "car-booking" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("carbooking")}
              >
                รายชื่อการยืมรถ
              </button>
              {/* <button
                className={`p-2 ml-2 rounded-t-lg ${
                  activeButton === "editcar" ? "bg-white" : "bg-gray-300"
                } ${
                  isButtonDisabled("editcar")
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleButtonClick("editcar")}
                disabled={isButtonDisabled("editcar")}
              >
                สถานะการยืนยันคำขอ
              </button> */}
            </div>
          )}
          {activeMenu === "expense-system" && (
            <div className="">
              <button
                className={`p-2 rounded-t-lg ${
                  activeButton === "expense-system" ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => handleButtonClick("expense-system")}
              >
                การขอเบิกเงิน
              </button>
              {/* <button
                className={`p-2 ml-2 rounded-t-lg ${
                  activeButton === "editexpense" ? "bg-white" : "bg-gray-300"
                } ${
                  isButtonDisabled("editexpense")
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handleButtonClick("editexpense")}
                disabled={isButtonDisabled("editexpense")}
              >
                สถานะการขอเบิกเงิน
              </button> */}
            </div>
          )}
        </div>

        <div className="h-full bg-white overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
