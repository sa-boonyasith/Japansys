import React from "react";
import Sidebar from "../component/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ user, onLogout }) => {


  return (
    <div className="grid grid-cols-[300px_1fr] h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800">
        <Sidebar onLogout={onLogout} />
      </div>

      {/* Main Content */}
      <div className="bg-[#b3b2ae] pt-[90px] p-[40px] border-l border-gray-300 overflow-y-auto relative">
        {/* Header */}
        <div className="absolute top-4 right-[50px] bg-[#576F73] text-white px-4 py-2 border-[3px] border-white  rounded-3xl shadow-lg">
          {user?.firstname} {user?.lastname}
        </div>

        {/* Main Content */}
        <div className="border border-gray-400 h-full p-4 bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
