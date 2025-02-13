import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../img/japanlogo.png";

const Sidebar = ({ onToggleJobButtons }) => {
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ดึง user จาก localStorage แทนการใช้ location.state
  const user = JSON.parse(localStorage.getItem("user"));
  const isRecruit = user?.role === "recruit";

  const handleSectionClick = (section) => {
    // ถ้าเป็น recruit และไม่ใช่ workOffice ให้ไม่ทำอะไร
    if (isRecruit && section !== "workOffice") return;
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const handleSubMenuClick = (menu) => {
    // ถ้าเป็น recruit และไม่ใช่ Job ให้ไม่ทำอะไร
    if (isRecruit && menu !== "Job") return;

    console.log(`Menu clicked: ${menu}`);

    if (menu === "Job") {
      onToggleJobButtons("Job");
      navigate("/dashboard/Job");
    } else if (!isRecruit) {
      // เมนูอื่นๆ จะทำงานเฉพาะเมื่อไม่ใช่ recruit
      if (menu === "attend") {
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
      } else if (menu === "car-booking") {
        onToggleJobButtons("car-booking");
        navigate("/dashboard/car-booking");
      } else if (menu === "expense-system") {
        onToggleJobButtons("expense-system");
        navigate("/dashboard/expense-system");
      } else if (menu === "salary") {
        onToggleJobButtons("salary");
        navigate("/dashboard/salary");
      } else if (menu === "trial") {
        onToggleJobButtons("trial");
        navigate("/dashboard/trial");
      } else if (menu === "progress") {
        onToggleJobButtons("progress");
        navigate("/dashboard/progress");
      } else if (menu === "leave-status") {
        onToggleJobButtons("leave-status");
        navigate("/dashboard/leave-status");
      } else if (menu === "employee"){
        onToggleJobButtons("employee")
        navigate("/dashboard/employee")
      } else if (menu === "addcus") {
        onToggleJobButtons("addcus");
        navigate("/dashboard/addcustomer");
      } else if (menu === "quotation") {
        navigate("/dashboard/quotation");
      } else if (menu === "invoice") {
        navigate("/dashboard/invoice");
      } else {
        onToggleJobButtons(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.setItem("logoutTime", new Date().getTime().toString());
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("lastPath");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  // สร้างคลาสสำหรับปุ่มที่ถูก disable
  const getMenuItemClass = (isDisabled) => `
    block p-2 border-b 
    ${
      isDisabled
        ? "bg-gray-400 cursor-not-allowed opacity-50"
        : "bg-buttonnonactive hover:bg-buttonactive cursor-pointer"
    } 
    transition
  `;

  return (
    <div className="flex h-screen bg-[#B4B2AF]">
      <aside className="w-80 bg-background shadow-md flex flex-col">
        <div className="flex items-center justify-center bg-background py-3">
          <img src={logo} alt="Logo" className="w-[150px] h-auto" />
        </div>

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
                  className={getMenuItemClass(false)}
                  onClick={() => handleSubMenuClick("Job")}
                  role="button"
                >
                  ระบบสมัครงาน
                </li>
                {!isRecruit && (
                  <>
                    <li
                      className={getMenuItemClass(isRecruit)}
                      onClick={() => handleSubMenuClick("attend")}
                      role="button"
                    >
                      ระบบลงเวลาทำงาน
                    </li>
                    <li
                      className={getMenuItemClass(isRecruit)}
                      onClick={() => handleSubMenuClick("todo-list")}
                      role="button"
                    >
                      ระบบ Todo-List
                    </li>
                    <li
                      className={getMenuItemClass(isRecruit)}
                      onClick={() => handleSubMenuClick("leave-system")}
                      role="button"
                    >
                      ระบบลาพนักงาน
                    </li>
                    <li
                      className={getMenuItemClass(isRecruit)}
                      onClick={() => handleSubMenuClick("meeting")}
                      role="button"
                    >
                      ระบบจองห้องประชุม
                    </li>
                    <li
                      className={getMenuItemClass(isRecruit)}
                      onClick={() => handleSubMenuClick("car-booking")}
                      role="button"
                    >
                      ระบบจองรถ
                    </li>
                    <li
                      className={getMenuItemClass(isRecruit)}
                      onClick={() => handleSubMenuClick("expense-system")}
                      role="button"
                    >
                      ระบบเบิกค่าใช้จ่าย
                    </li>
                    <li
                      className={getMenuItemClass(isRecruit)}
                      onClick={() => handleSubMenuClick("salary")}
                      role="button"
                    >
                      ระบบเงินเดือน
                    </li>
                    {user?.role === 'admin' &&(
                    <li
                      className={getMenuItemClass(isRecruit)}
                      onClick={() => handleSubMenuClick("employee")}
                      role="button"
                    >
                      พนักงาน
                    </li>
                    )}
                  </>
                )}
              </ul>
            )}
          </li>

          {/* Customer Service และ Financial System จะแสดงเฉพาะเมื่อไม่ใช่ recruit */}
          {!isRecruit && (
            <>
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
                    <li
                      className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition cursor-pointer"
                      onClick={() => handleSubMenuClick("addcus")}
                      role="button"
                    >
                      เพิ่มข้อมูลลูกค้า
                    </li>
                    <li
                      className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition cursor-pointer"
                      onClick={() => handleSubMenuClick("quotation")}
                      role="button"
                    >
                      Quotaion/ใบเสนอราคา
                    </li>
                    <li
                      className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition cursor-pointer"
                      onClick={() => handleSubMenuClick("invoice")}
                      role="button"
                    >
                      Invoice/ใบแจ้งหนี้
                    </li>
                    <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                      <Link to="/register/feedback">
                        Receipt/ใบเสร็จรับเงิน
                      </Link>
                    </li>
                    <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                      <Link to="/register/feedback">นัดประชุมกับลูกค้า</Link>
                    </li>
                    <li className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition">
                      <Link to="/register/feedback">
                        ร่างเอกสารสัญญารักษาความลับ
                      </Link>
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
            </>
          )}
        </ul>

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
