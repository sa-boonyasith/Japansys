import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Todo from "./pages/todo";
import Job from "./pages/Job";
import Attend from "./pages/attend";
import LeaveSystem from "./pages/LeaveSystem";
import DashboardLayout from "./dashboard/DashboardLayout";



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null)

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
        {isAuthenticated ? (
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Nested Routes */}
            <Route path="job" element={<Job onLogout={handleLogout} />} />
            <Route path="attend" element={<Attend onLogout={handleLogout} />} />
            <Route path="todo-list" element={<Todo onLogout={handleLogout} />} />
            <Route path="leave-system" element={<LeaveSystem onLogout={handleLogout} />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
