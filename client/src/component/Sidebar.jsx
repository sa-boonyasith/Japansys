import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"; // ใช้ useNavigate สำหรับการนำทาง
import logo from "../img/japanlogo.png";

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();

  const handleSectionClick = (section) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const location = useLocation()
  const user =location.state?.user

  const handleLogout = () => {
    // ลบข้อมูล auth token ออกจาก localStorage
    localStorage.removeItem("authToken");

    // นำทางกลับไปยังหน้า login
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#B4B2AF]">
      {/* Sidebar */}
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
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/dashboard/Job">ระบบสมัครงาน</Link>
                </li>
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/dashboard/attend">ระบบลงเวลาทำงาน</Link>
                </li>
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/dashboard/todo-list">ระบบ To do list</Link>
                </li>
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/dashboard/leave-system">ระบบลาพนักงาน</Link>
                </li>
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/dashboard/meeting-room">ระบบจองห้องประชุม</Link>
                </li>
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/dashboard/car-booking">ระบบจองรถ</Link>
                </li>
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/dashboard/expense-system">ระบบเบิกค่าใช้จ่าย</Link>
                </li>
                <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                  <Link to="/dashboard/payroll-system">ระบบเงินเดือน</Link>
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
                  <Link to="/register/service-requests">Service Requests</Link>
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
