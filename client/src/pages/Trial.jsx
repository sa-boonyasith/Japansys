import React, { useState, useEffect } from "react";
import axios from "axios";

const Trial = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/jobaplication")
      .then((response) => {
        // กรองเฉพาะผู้ที่มี status === "pass"
        const passedApplications = response.data.listjobaplication.filter(
          (app) => app.status === "pass"
        );
        setApplications(passedApplications);
        setLoading(false); // โหลดเสร็จ
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        setLoading(false); // โหลดเสร็จแม้ว่าจะมีข้อผิดพลาด
      });
  }, []);

  // Action handlers
  const handleApprove = async (id) => {
    try {
      const jobApplicationResponse = await axios.get(
        `http://localhost:8080/api/jobaplication/${id}`
      );
  
      const jobApplication = jobApplicationResponse.data;
  
      const newEmployee = {
        firstname: jobApplication.firstname,
        lastname: jobApplication.lastname,
        job_position: jobApplication.job_position,
        salary: jobApplication.expected_salary,
        phone_number: jobApplication.phone_number,
        email: jobApplication.email,
        personal_info: jobApplication.personal_info,
        documents: jobApplication.documents,
        liveby: jobApplication.liveby,
        birth_date: jobApplication.birth_date,
        age: jobApplication.age,
        ethnicity: jobApplication.ethnicity,
        nationality: jobApplication.nationality,
        religion: jobApplication.religion,
        marital_status: jobApplication.marital_status,
        military_status: jobApplication.military_status,
        photo :jobApplication.photo,
        role: 'employee',
      };
  
      await axios.post('http://localhost:8080/api/employee', newEmployee);
      await axios.delete(`http://localhost:8080/api/jobaplication/${id}`);
      setApplications((prevApplications) =>
        prevApplications.filter((app) => app.job_id !== id)
      );
      alert('เพิ่มพนักงานและลบผู้สมัครงานสำเร็จ!');
    } catch (error) {
      console.error('Error in handleApprove:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มพนักงานหรือลบผู้สมัครงาน');
    }
  };

  const handleReject = (id) => {
    // เรียก API ลบข้อมูลออกจากฐานข้อมูล
    axios
      .delete(`http://localhost:8080/api/jobaplication/${id}`)
      .then(() => {
        console.log(`Deleted application with ID: ${id}`);
        // อัปเดต State หลังลบสำเร็จ
        setApplications((prevApplications) =>
          prevApplications.filter((app) => app.job_id !== id)
        );
      })
      .catch((error) => {
        console.error("Error deleting application:", error);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      });
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2">ชื่อ</th>
              <th className="border border-gray-300 px-4 py-2">ตำแหน่ง</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.job_id}>
                <td className="border border-gray-300 px-4 py-2">
                  {app.firstname} {app.lastname}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {app.job_position}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-4">
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleApprove(app.job_id)}
                    aria-label="Approve"
                  >
                    ✔
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleReject(app.job_id)}
                    aria-label="Reject"
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trial;
