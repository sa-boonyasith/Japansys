import React, { useState, useEffect } from "react";

const Trial = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/jobaplication")
      .then((response) => response.json())
      .then((data) => {
        const passedApplications = data.listjobaplication.filter(
          (app) => app.status === "pass"
        );
        setApplications(passedApplications);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id) => {
    try {
      // ดึงข้อมูล jobApplication (เพื่อตรวจสอบ)
      const response = await fetch(`http://localhost:8080/api/jobaplication/${id}`);
      const jobApplication = await response.json();
  
      console.log("Job Application Data:", jobApplication); // ตรวจสอบข้อมูลใน console
  
      // ส่ง PATCH request ไปยัง jobApplication เพื่ออนุมัติและย้ายไป employee
      const patchResponse = await fetch(`http://localhost:8080/api/jobaplication/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!patchResponse.ok) {
        throw new Error("Failed to approve job application");
      }
  
      // รับข้อมูล username และ password ที่สร้างจาก API
      const result = await patchResponse.json();
      const { username, password,employee_id } = result.user;
  
      // อัปเดตรายการ job applications ใน state
      setApplications((prevApplications) =>
        prevApplications.filter((app) => app.job_id !== id)
      );
  
      // แสดง username และ password ผ่าน alert
      alert(`✅ เพิ่มพนักงานสำเร็จ!
    
        👤 Username: ${username}
        🔑 Password: ${password}
        🆔 Employee ID: ${employee_id}`);
  
    } catch (error) {
      console.error("Error in handleApprove:", error);
      alert("❌ เกิดข้อผิดพลาดในการเพิ่มพนักงาน");
    }
  };
  

  const handleReject = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/jobaplication/${id}`, {
        method: "DELETE",
      });
      setApplications((prevApplications) =>
        prevApplications.filter((app) => app.job_id !== id)
      );
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-lg">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ">
      <div className="px-6 py-4 border-b border-gray-200 mb-5">
        <h2 className="text-2xl font-semibold text-gray-800">
          รายชื่อผู้ทดลองงาน
        </h2>
      </div>

      <div className="bg-white  rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  ชื่อ-นามสกุล
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  ตำแหน่ง
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr
                  key={app.job_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {app.firstname} {app.lastname}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {app.job_position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleApprove(app.job_id)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
                        title="อนุมัติ"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleReject(app.job_id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                        title="ปฏิเสธ"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Trial;
