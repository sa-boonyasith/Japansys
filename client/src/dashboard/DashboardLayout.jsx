import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ user, onLogout }) => {
  return (
    <div className="grid grid-cols-[300px_1fr] h-screen">
      {/* Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Main Content */}
      <div className="bg-gray-100 p-4 overflow-y-auto relative">
        {/* แสดงข้อมูล user ที่ด้านบนขวาของ DashboardLayout */}
        <div className="absolute top-4 right-4 bg-gray-200 px-4 py-2 rounded shadow">
          {user ? (
            <div>
              <p>Firstname: {user.firstname}</p>
              <p>Lastname: {user.lastname}</p>
              <p>Role: {user.role}</p>
            </div>
          ) : (
            <p>No user data available</p>
          )}
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
