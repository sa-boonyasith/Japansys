import React, { useState } from "react";
import logo from "../img/japanlogo.png";

const Sidebar = () => {
  const [isWorkOfficeOpen, setIsWorkOfficeOpen] = useState(false);
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const [isFinancialSystemOpen, setIsFinancialSystemOpen] = useState(false);

  const toggleWorkOfficeDropdown = () => {
    setIsWorkOfficeOpen((prev) => !prev);
  };

  const toggleCustomerServiceDropdown = () => {
    setIsCustomerServiceOpen((prev) => !prev);
  };

  const toggleFinancialSystemDropdown = () => {
    setIsFinancialSystemOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-[#B4B2AF] ่">
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
              className={`flex items-center justify-center cursor-pointer p-3 border-b  hover:bg-buttonactive transition ${
                isWorkOfficeOpen ? "bg-buttonactive" : "bg-buttonnonactive"
              }`}
              onClick={toggleWorkOfficeDropdown}
              role="button"
              aria-expanded={isWorkOfficeOpen}
              aria-controls="work-office-dropdown"
            >
              <b>Work Office</b>
            </div>
            {isWorkOfficeOpen && (
              <ul id="work-office-dropdown" className=" text-center text-sm text-white">
                <li>
                  <b
                    href="#time-tracking"
                    className="block p-2  border-b bg-buttonnonactive hover:bg-buttonactive transition"
                  >
                    ระบบลงเวลาทำงาน
                  </b>
                </li>
                <li>
                  <b
                    href="#todo-list"
                    className="block p-2 border-b  bg-buttonnonactive hover:bg-buttonactive transition"
                  >
                    ระบบ To do list
                  </b>
                </li>
                <li>
                  <b
                    href="#leave-system"
                    className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition"
                  >
                    ระบบลาพนักงาน
                  </b>
                </li>
                <li>
                  <b
                    href="#meeting-room"
                    className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition"
                  >
                    ระบบจองห้องประชุม
                  </b>
                </li>
                <li>
                  <b
                    href="#car-booking"
                    className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition"
                  >
                    ระบบจองรถ
                  </b>
                </li>
                <li>
                  <b
                    href="#expense-system"
                    className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition"
                  >
                    ระบบเบิกค่าใช้จ่าย
                  </b>
                </li>
                <li>
                  <b
                    href="#payroll-system"
                    className="block p-2 border-b   bg-buttonnonactive hover:bg-buttonactive transition"
                  >
                    ระบบเงินเดือน
                  </b>
                </li>
              </ul>
            )}
          </li>

          {/* Customer Service Dropdown */}
          <li>
            <div
              className="flex items-center justify-center cursor-pointer p-3 bg-buttonnonactive border-b hover:bg-buttonactive transition"
              onClick={toggleCustomerServiceDropdown}
              role="button"
              aria-expanded={isCustomerServiceOpen}
              aria-controls="customer-service-dropdown"
            >
              <b>Customer Service</b>
            </div>
            {isCustomerServiceOpen && (
              <ul
                id="customer-service-dropdown"
                className="border-b text-sm text-white text-center"
              >
                <li>
                  <b
                    href="#service-requests"
                    className="block p-2 border-b  bg-buttonnonactive hover:bg-buttonactive transition"
                  >
                    Service Requests
                  </b>
                </li>
                <li>
                  <b
                    href="#feedback"
                    className="block p-2 border-b  bg-buttonnonactive hover:bg-buttonactive transition"
                  >
                    Feedback
                  </b>
                </li>
              </ul>
            )}
          </li>

          {/* Financial System Dropdown */}
          <li>
            <div
              className="flex justify-center items-center cursor-pointer p-3 bg-buttonnonactive border-b hover:bg-buttonactive transition"
              onClick={toggleFinancialSystemDropdown}
              role="button"
              aria-expanded={isFinancialSystemOpen}
              aria-controls="financial-system-dropdown"
            >
              <b>Financial System</b>
            </div>
            {isFinancialSystemOpen && (
              <ul
                id="financial-system-dropdown"
                className=" text-sm text-white text-center"
              >
                <li>
                  <b
                    href="#reports"
                    className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition"
                  >
                    Reports
                  </b>
                </li>
                <li>
                  <b
                    href="#invoices"
                    className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition"
                  >
                    Invoices
                  </b>
                </li>
                <li>
                  <b
                    href="#budgets"
                    className="block p-2 border-b bg-buttonnonactive hover:bg-buttonactive transition"
                  >
                    Budgets
                  </b>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Logout Button */}
        <div className="p-4">
          <button className="btn text-white bg-buttonnonactive w-full hover:bg-buttonactive transition ">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 w-screen">
        <h1 className="text-2xl font-bold">Main Content</h1>
        <p>This is where the main page content will go.</p>
      </main>
    </div>
  );
};

export default Sidebar;
