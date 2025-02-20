import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import Trial from "./pages/Trial";
import Checkout from "./pages/Checkout";
import Progress from "./pages/Progress";
import Test from "./pages/Test";
import Test2 from "./pages/Test2";
import EditCarbooking from "./pages/EditCarbooking";
import EditMeeting from "./pages/EditMeeting";
import EditExpense from "./pages/EditExpense";
import LeaveStatus from "./pages/LeaveStatus";
import AddCustomer from "./pages/AddCustomer";
import Quotation from "./pages/Quotation";
import Invoice from "./pages/Invoice";
import Employeelist from "./pages/Employeelist";
import Receipt from "./pages/Receipt";
import MeetingCustomer from "./pages/MeetingCustomer";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleToggleJobButtons = (menu) => {
    setActiveMenu(menu);
  };

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated") === "true";
      const storedUser = localStorage.getItem("user");
      const lastPath = localStorage.getItem("lastPath");
      const logoutTime = localStorage.getItem("logoutTime");

      // Check if user has logged out recently
      if (logoutTime) {
        // Clear all auth data if there was a logout
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        localStorage.removeItem("lastPath");
        localStorage.removeItem("logoutTime");
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      if (authStatus && storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
        if (lastPath && window.location.pathname === "/") {
          window.location.href = lastPath;
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("lastPath");
      }
    };

    checkAuth();
    setLoading(false);
  }, []);

  // เพิ่ม effect สำหรับเก็บ path ปัจจุบัน
  useEffect(() => {
    if (isAuthenticated && window.location.pathname !== "/") {
      localStorage.setItem("lastPath", window.location.pathname);
    }
  }, [isAuthenticated, window.location.pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white text-2xl font-bold">
        กำลังโหลด...
      </div>
    );
  }

  const PrivateRoute = ({ children, allowedRoles }) => {
    const logoutTime = localStorage.getItem("logoutTime");
    
    // Prevent access if there was a recent logout
    if (logoutTime) {
      localStorage.removeItem("lastPath");
      return <Navigate to="/" />;
    }

    if (!isAuthenticated) {
      localStorage.setItem("lastPath", window.location.pathname);
      return <Navigate to="/" />;
    }

    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard/Job" />;
    }

    return children;
  };

  const handleLogin = (userData) => {
    // Clear any logout timestamp when logging in
    localStorage.removeItem("logoutTime");
    
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    
    const lastPath = localStorage.getItem("lastPath") || "/dashboard/job";
    window.location.href = lastPath;
  };

  const handleLogout = () => {
    // Set logout timestamp
    localStorage.setItem("logoutTime", new Date().getTime().toString());
    
    // Clear auth data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("lastPath");
    
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/1" element={<Test />} />
        <Route path="/2" element={<Test2 />} />
        {isAuthenticated ? (
          <Route
            path="/dashboard"
            element={
              <DashboardLayout
                user={user}
                onLogout={handleLogout}
                activeMenu={activeMenu}
                onToggleJobButtons={handleToggleJobButtons}
              />
            }
          >
            <Route
              path="job"
              element={
                <PrivateRoute allowedRoles={["admin", "employee", "recruit"]}>
                  <Job />
                </PrivateRoute>
              }
            />
            <Route
              path="attend"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <Attend />
                </PrivateRoute>
              }
            />
            <Route
              path="todo-list"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <Todo />
                </PrivateRoute>
              }
            />
            <Route
              path="leave-system"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <LeaveSystem />
                </PrivateRoute>
              }
            />
            <Route
              path="meeting"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <Meeting />
                </PrivateRoute>
              }
            />
            <Route
              path="car-booking"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <Carbooking />
                </PrivateRoute>
              }
            />
            <Route
              path="expense-system"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <ExpenseSystem />
                </PrivateRoute>
              }
            />
            <Route
              path="salary"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <Salary />
                </PrivateRoute>
              }
            />
            <Route
              path="trial"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <Trial />
                </PrivateRoute>
              }
            />
            <Route
              path="editcar"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <EditCarbooking />
                </PrivateRoute>
              }
            />
            <Route
              path="editmeeting"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <EditMeeting />
                </PrivateRoute>
              }
            />
            <Route
              path="editexpense"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <EditExpense />
                </PrivateRoute>
              }
            />
            <Route
              path="checkout"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="progress"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <Progress />
                </PrivateRoute>
              }
            />
            <Route
              path="leave-status"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <LeaveStatus />
                </PrivateRoute>
              }
            />
            <Route
              path="employee"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <Employeelist />
                </PrivateRoute>
              }
            />
            <Route
              path="addcustomer"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <AddCustomer />
                </PrivateRoute>
              }
            />
            <Route
              path="quotation"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <Quotation />
                </PrivateRoute>
              }
            />
            <Route
              path="receipt"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <Receipt />
                </PrivateRoute>
              }
            />
            <Route
              path="meetingcustomer"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <MeetingCustomer />
                </PrivateRoute>
              }
            />
            <Route
              path="invoice"
              element={
                <PrivateRoute allowedRoles={["admin", "employee"]}>
                  <Invoice />
                </PrivateRoute>
              }
            />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;