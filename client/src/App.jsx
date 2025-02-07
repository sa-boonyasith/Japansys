import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Todo from "./pages/Todo";
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
import Test from "./pages/Test"
import Test2 from "./pages/Test2"
import EditCarbooking from "./pages/EditCarbooking";
import EditMeeting from "./pages/EditMeeting";
import EditExpense from "./pages/EditExpense";
import LeaveStatus from "./pages/LeaveStatus";
import AddCustomer from "./pages/AddCustomer";
import Quotation from "./pages/Quotation";
import Invoice from "./pages/Invoice";


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
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  
    // เช็คว่าถ้าไม่ใช่หน้า Login ค่อย setLoading(false)
    if (window.location.pathname == "/") {
      setLoading(false);
    }
  }, []);
  
  
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white text-2xl font-bold">
        มึงกลับไป login ซะไอสัส
      </div>
    );
  }
  
  const PrivateRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
  
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard/job" />;
    }
  
    return children;
  };
    

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/1" element={<Test />} />
        <Route path="/2" element={<Test2/>}></Route>
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
            <Route
            path="job"
            element={
              <PrivateRoute allowedRoles={["admin", "user", "recruit"]}>
                <Job />
              </PrivateRoute>
            }
           />
            <Route path="attend" element={<Attend />} />
            <Route path="todo-list" element={<Todo />} />
            <Route path="leave-system" element={<LeaveSystem />} />
            <Route path="meeting" element={<Meeting />} />
            <Route path="car-booking" element={<Carbooking />} />
            <Route path="expense-system" element={<ExpenseSystem />} />
            <Route path="salary" element={<Salary />} />
            <Route path="trial" element={<Trial />} />
            <Route path="editcar" element={<EditCarbooking />} />
            <Route path="editmeeting" element={<EditMeeting />} />
            <Route path="editexpense" element={<EditExpense />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="progress" element={<Progress />} />
            <Route path="leave-status" element={<LeaveStatus />} />
            <Route path="addcustomer" element={<AddCustomer/>}/>
            <Route path="quotation" element={<Quotation/>}/>
            <Route path="invoice" element={<Invoice/>}/>
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;