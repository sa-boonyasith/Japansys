import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import JobApplication from "./dashboard/JobApplication";
import AdminSidebar from "./dashboard/Admin/AdminSidebar"
import RecruitSidebar from "./dashboard/Recruit/RecruitSidebar"
import ManagerSidebar from "./dashboard/Manager/ManagerSidebar"
import EmployeeSidebar from "./dashboard/Employee/EmployeeSidebar";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/admin" element={<AdminSidebar />} />
        <Route path="/dashboard/recruit" element={<RecruitSidebar />} />
        <Route path="/dashboard/manager" element={<ManagerSidebar />} />
        <Route path="/dashboard/employee" element={<EmployeeSidebar />} />
        <Route path="/dashboard/Main" element={<JobApplication />} />
      </Routes>
    </Router>
  );
};

export default App;
