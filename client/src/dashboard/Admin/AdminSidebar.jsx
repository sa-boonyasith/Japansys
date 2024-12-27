import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/japanlogo.png"; // Ensure this path is correct

const AdminSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("firstname");
    localStorage.removeItem("lastname");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 shadow-md p-4">
        <img src={logo} alt="Logo" className="w-32 mx-auto mb-4" />
        <ul className="space-y-2 text-left">
          <li className="text-lg font-semibold">Work Office</li>
          <li>
            <a href="#!" className="block py-2 hover:bg-gray-200 rounded-md pl-4">
              ระบบสมัครงาน
            </a>
          </li>
          <li>
            <a href="#!" className="block py-2 hover:bg-gray-200 rounded-md pl-4">
              ระบบบอกเวลาทำงาน
            </a>
          </li>
          <li>
            <a href="#!" className="block py-2 hover:bg-gray-200 rounded-md pl-4">
              ระบบ To Do List
            </a>
          </li>
          <li>
            <a href="#!" className="block py-2 hover:bg-gray-200 rounded-md pl-4">
              ระบบพบหน้า
            </a>
          </li>
          <li>
            <a href="#!" className="block py-2 hover:bg-gray-200 rounded-md pl-4">
              ระบบจองห้องประชุม
            </a>
          </li>
          <li>
            <a href="#!" className="block py-2 hover:bg-gray-200 rounded-md pl-4">
              ระบบเอกสาร
            </a>
          </li>
        </ul>
        <hr className="my-4" />
        <ul>
          <li className="text-lg font-semibold">Customer Service</li>
          <li>
            <a href="#!" className="block py-2 hover:bg-gray-200 rounded-md pl-4">
              Financial System
            </a>
          </li>
        </ul>
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 mt-4 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-gray-50 p-6">
        {/* Tab Navigation */}
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">FirstName LastName</h1>
          <div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
              สมัครงาน
            </button>
            <button className="px-4 py-2 ml-2 bg-gray-300 rounded-md">
              ทดลองงาน
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="bg-blue-100 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-2 text-blue-700">ผู้สมัครใหม่</h2>
            <div>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-2 bg-white shadow rounded-md mb-2"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-2"></div>
                    <span>Firstname Lastname</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-green-500">✔</button>
                    <button className="text-red-500">✖</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div className="bg-yellow-100 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-2 text-yellow-700">รอสัมภาษณ์</h2>
            <div>
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-2 bg-white shadow rounded-md mb-2"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-2"></div>
                    <span>Firstname Lastname</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-green-500">✔</button>
                    <button className="text-red-500">✖</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 */}
          <div className="bg-green-100 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-2 text-green-700">ผ่านสัมภาษณ์</h2>
            <div>
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-2 bg-white shadow rounded-md mb-2"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-2"></div>
                    <span>Firstname Lastname</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-green-500">✔</button>
                    <button className="text-red-500">✖</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
