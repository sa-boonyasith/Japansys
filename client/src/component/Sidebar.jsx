import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // ใช้ useNavigate สำหรับการนำทาง
import logo from "../img/japanlogo.png";

const Sidebar = ({ onToggleJobButtons,  }) => {
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const handleSectionClick = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const handleSubMenuClick = (menu) => {
    console.log(`Menu clicked: ${menu}`);
    
    if (menu === "Job") {
      onToggleJobButtons("Job");
      navigate("/dashboard/Job");
    } else if (menu === "attend") {
      onToggleJobButtons("attend");
      navigate("/dashboard/attend");
    } else if (menu === "todo-list") {
      onToggleJobButtons("todo-list");
      navigate("/dashboard/todo-list");
    } else if (menu === "leave-system") {
      onToggleJobButtons("leave-system");
      navigate("/dashboard/leave-system");
    } else if (menu === "meeting") {
      onToggleJobButtons("meeting");
      navigate("/dashboard/meeting");
    }else if (menu === "car-booking") {
      onToggleJobButtons("car-booking");
      navigate("/dashboard/car-booking");
    }else if (menu === "expense-system") {
      onToggleJobButtons("expense-system");
      navigate("/dashboard/expense-system");
    }else if (menu === "salary") {
      onToggleJobButtons("salary");
      navigate("/dashboard/salary");
    } else if (menu === "trial") { // กรณีที่เลือก "ทดลองงาน"
      onToggleJobButtons("trial");
      navigate("/dashboard/trial");  // นำทางไปยังหน้า trial
    } else if (menu ==="progress") {
      onToggleJobButtons("progress")
      navigate("/dashboard/progress") 
    } else if (menu ==="leave-system") {
      onToggleJobButtons("leave-system")
      navigate("/dashboard/leave-system") 
    } else if (menu ==="leave-status") {
      onToggleJobButtons("leave-status")
      navigate("/dashboard/leave-status")
    } 
    
    else {
      onToggleJobButtons(null); // ซ่อนปุ่ม
    }
  };
  
  

  const handleLogout = () => {
    // ลบข้อมูล auth token ออกจาก localStorage
    localStorage.removeItem("authToken");

    // นำทางกลับไปยังหน้า login
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#B4B2AF]">
      <aside className="w-80 bg-background shadow-md flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center bg-background py-3">
          <img src={logo} alt="Logo" className="w-[150px] h-auto" />
        </div>

        {/* Menu Items */}
        <ul className="flex-1 text-white">
          {/* Work Office Dropdown */}
          <li>
            <div
              className={`flex items-center justify-center cursor-pointer p-3 border-b hover:bg-buttonactive transition ${
                activeSection === "workOffice"
                  ? "bg-buttonactive"
                  : "bg-buttonnonactive"
              }`}
              onClick={() => handleSectionClick("workOffice")}
              role="button"
            >
              <b>Work Office</b>
            </div>
            {activeSection === "workOffice" && (
              <ul className="text-center text-sm text-white">
                <li
                  className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition cursor-pointer"
                  onClick={() => handleSubMenuClick("Job")}
                  role="button"
                >
                  ระบบสมัครงาน
                </li>
                <li
                  className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition cursor-pointer"
                  onClick={() => handleSubMenuClick("attend")}
                  role="button"
                >
                  ระบบลงเวลาทำงาน
                </li>

                <li
                  className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition cursor-pointer"
                  onClick={() => handleSubMenuClick("todo-list")}
                  role="button"
                >
                  ระบบ Todo-List
                </li>
                <li 
                onClick={()=> handleSubMenuClick("leave-system")}
                role="button"
                className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                 ระบบลาพนักงาน
                </li>
                <li 
                onClick={()=> handleSubMenuClick("meeting")}
                role="button"
                className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  ระบบจองห้องประชุม
                </li>
                <li
                onClick={()=> handleSubMenuClick("car-booking")}
                role="button"
                className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  ระบบจองรถ
                </li>
                <li
                onClick={()=> handleSubMenuClick("expense-system")}
                role="button"
                className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  ระบบเบิกค่าใช้จ่าย
                </li>
                <li
                onClick={()=> handleSubMenuClick("salary")}
                role="button"
                className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  ระบบเงินเดือน
                </li>
              </ul>
            )}
          </li>

          {/* Customer Service Dropdown */}
          <li>
            <div
              className={`flex items-center justify-center cursor-pointer p-3 border-b hover:bg-buttonactive transition ${
                activeSection === "customerService"
                  ? "bg-buttonactive"
                  : "bg-buttonnonactive"
              }`}
              onClick={() => handleSectionClick("customerService")}
              role="button"
            >
              <b>Customer Service</b>
            </div>
            {activeSection === "customerService" && (
              <ul className="text-center text-sm text-white">
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/dashboard/service-requests">Service Requests</Link>
                </li>
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/register/feedback">Feedback</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Financial System Dropdown */}
          <li>
            <div
              className={`flex items-center justify-center cursor-pointer p-3 border-b hover:bg-buttonactive transition ${
                activeSection === "financialSystem"
                  ? "bg-buttonactive"
                  : "bg-buttonnonactive"
              }`}
              onClick={() => handleSectionClick("financialSystem")}
              role="button"
            >
              <b>Financial System</b>
            </div>
            {activeSection === "financialSystem" && (
              <ul className="text-center text-sm text-white">
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/register/reports">Reports</Link>
                </li>
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/register/invoices">Invoices</Link>
                </li>
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/register/budgets">Budgets</Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="btn text-white bg-buttonnonactive w-full hover:bg-buttonactive transition"
          >
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
