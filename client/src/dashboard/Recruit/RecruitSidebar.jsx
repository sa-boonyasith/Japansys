import React from 'react'
import { useLocation } from "react-router-dom"; // แก้ไขจาก uselocation เป็น useLocation


const RecruitSidebar = () => {

  const location = useLocation()
  const user = location.state?.user



  return (
    <div>
      <h1>Recruit Sidebar</h1>
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
  )
}

export default RecruitSidebar