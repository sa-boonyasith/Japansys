import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Todo from "./pages/todo";
import Job from "./pages/Job";
import Attend from "./pages/attend";
import LeaveSystem from "./pages/LeaveSystem";
import DashboardLayout from "./dashboard/DashboardLayout";
import Meeting from "./pages/Meeting";
import Salary from "./pages/Salary";
import Carbooking from "./pages/Carbooking";
import ExpenseSystem from "./pages/ExpenseSystem";
import Trial from "./pages/Trial"

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleToggleJobButtons = (menu) => {
    setActiveMenu(menu); // อัพเดตค่า activeMenu
  };

  // Load auth status and user data from localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const storedUser = localStorage.getItem("user");
    setIsAuthenticated(authStatus);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {isAuthenticated ? (
          <Route
            path="/dashboard"
            element={
              <DashboardLayout
                user={user}
                onLogout={handleLogout}
                activeMenu={activeMenu} // ส่ง activeMenu ไปที่ DashboardLayout
                onToggleJobButtons={handleToggleJobButtons} // ส่งฟังก์ชันเพื่ออัพเดตเมนูที่เลือก
              />
            }
          >
            <Route path="job" element={<Job />} />
            <Route path="attend" element={<Attend />} />
            <Route path="todo-list" element={<Todo />} />
            <Route path="leave-system" element={<LeaveSystem />} />
            <Route path="meeting" element={<Meeting />} />
            <Route path="car-booking" element={<Carbooking />} />
            <Route path="expense-system" element={<ExpenseSystem />} />
            <Route path="salary" element={<Salary />} />
            <Route path="Job/trial" element={<Trial />} />
            
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
