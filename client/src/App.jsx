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
import Attend from "./pages/Attend";
import LeaveSystem from "./pages/LeaveSystem";
import DashboardLayout from "./dashboard/DashboardLayout";
import Meeting from "./pages/Meeting";
import Salary from "./pages/Salary";
import Carbooking from "./pages/Carbooking";
import ExpenseSystem from "./pages/ExpenseSystem";
import Trial from "./pages/Trial"
import Checkout from "./pages/Checkout";
import Progress from "./pages/Progress";
import Status from "./pages/Status";
import Test from "./pages/Test";
import Test2 from "./pages/Test2";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleToggleJobButtons = (menu) => {
    setActiveMenu(menu); // อัพเดตค่า activeMenu
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const storedUser = localStorage.getItem("user");
  
    if (authStatus && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  
    setLoading(false); // การโหลดสถานะเสร็จสมบูรณ์
  }, []);
  
  if (loading) {
    return <div>Loading...</div>; // แสดงหน้าจอโหลดระหว่างโหลดสถานะ
  }
  const PrivateRoute = ({ children }) => {
    if (!isAuthenticated && !loading) {
      return <Navigate to="/" />;
    }
    return children;
  };
    

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
        <Route path="/test2" element={<Test2 />} />
        <Route path="/test" element={<Test />} />
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
            <Route path="trial" element={<Trial />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="progress" element={<Progress />} />
            <Route path="leave-status" element={<Status />} />
            
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
