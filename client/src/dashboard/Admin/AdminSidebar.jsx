import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const user = location.state?.user;

  const logout = ()=>{
    localStorage.removeItem("authToken")
    localStorage.removeItem("firstname")
    localStorage.removeItem("lastname")
    localStorage.removeItem("role")

    Navigate("/")
  }
 



  return (
    <div>
      <h1>Admin Sidebar</h1>
      {user ? (
        <div>
          <p>Welcome, {user.firstname}!</p>
          <p>Lastname, {user.lastname}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default AdminSidebar;
