import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Todo from "./pages/todo";
import Job from "./pages/Job";
import Sidebar from "./component/Sidebar";

// Layout สำหรับแสดง Sidebar พร้อมเนื้อหาด้านใน
const DashboardLayout = ({ children }) => (
  <div className="dashboard-layout">
    <Sidebar />
    <div className="content">{children}</div>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ใช้ useEffect เพื่อโหลดสถานะการเข้าสู่ระบบจาก localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  // ฟังก์ชันสำหรับจัดการการเข้าสู่ระบบ
  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  // ฟังก์ชันสำหรับจัดการการออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Routes ที่ไม่ต้องตรวจสอบการ login */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes ที่ต้องตรวจสอบการ login */}
        <Route
          path="/dashboard/job"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <Job onLogout={handleLogout} />
              </DashboardLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/todo"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <Todo onLogout={handleLogout} />
              </DashboardLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
