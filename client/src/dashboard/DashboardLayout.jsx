import React from "react";
import Sidebar from "../component/Sidebar";
import { Outlet } from "react-router-dom";


const DashboardLayout = () => {
  return (
    <div className="grid grid-cols-[300px_1fr] h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="bg-gray-100 pt-[90px] p-[40px] border-l border-gray-300 overflow-y-auto">
        <div className="justify-center text-right">
            
      
        </div>
        <div className="border border-gray-400 rounded-lg h-full p-4 bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
