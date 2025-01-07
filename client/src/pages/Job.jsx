import React, { useEffect, useState } from "react";
import axios from "axios";

const Job = () => {
  const [applications, setApplications] = useState({
    new: [],
    wait: [],
    pass: [],
  });

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/jobaplication");
      const data = response.data.listjobaplication;

      const categorized = {
        new: data.filter((app) => app.status === "new"),
        wait: data.filter((app) => app.status === "wait"),
        pass: data.filter((app) => app.status === "pass"),
      };

      setApplications(categorized);
    } catch (error) {
      console.error("Error fetching job applications:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const deleteApplication = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/jobaplication/${id}`);

      setApplications((prev) => {
        const updated = { ...prev };
        for (const category in updated) {
          updated[category] = updated[category].filter((app) => app.job_id !== id);
        }
        return updated;
      });
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      console.log(`Updating status for id: ${id}, status: ${status}`);
      
      // ส่งข้อมูลสถานะใหม่ไปยัง API
      const response = await axios.put(`http://localhost:8080/api/jobaplications/${id}`, { status });
      console.log("API response:", response.data);
  
      setApplications((prev) => {
        const updated = { ...prev };
        let movedApp;
  
        // ค้นหาและลบข้อมูลจากสถานะเดิม
        for (const category in updated) {
          const index = updated[category].findIndex((app) => app.job_id === id);
          if (index !== -1) {
            movedApp = { ...updated[category][index], status };
            updated[category].splice(index, 1); // ลบออกจากสถานะเดิม
            break;
          }
        }
  
        // เพิ่มข้อมูลเข้าไปในสถานะใหม่
        if (movedApp) {
          updated[status].push(movedApp);
        } else {
          console.error(`Application with id ${id} not found in previous categories.`);
        }
  
        return updated;
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  
  // ปรับการเรียก updateStatus ในปุ่มติ๊กถูก ✓
  const renderColumn = (title, apps, statusColor) => (
    <div className={`w-full md:w-1/3 p-4`}>
      <div className={`border rounded-lg shadow-lg bg-${statusColor}-100`}>
        <h2 className={`text-${statusColor}-700 text-xl font-bold p-4 text-center`}>{title}</h2>
        <div className="p-4 space-y-4">
          {apps.map((app) => (
            <div
              key={app.job_id}
              className="flex items-center justify-between bg-white p-3 shadow rounded-md"
            >
              <div>
                <p className="font-semibold">{app.firstname} {app.lastname}</p>
                <p className="text-sm text-gray-500">{app.job_position}</p>
              </div>
              <div className="flex space-x-2">
                {title !== "ผ่านสัมภาษณ์" && (
                  <button
                    onClick={() =>
                      updateStatus(
                        app.job_id,
                        title === "ผู้สมัครใหม่" ? "wait" : "pass"
                      )
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    ✓
                  </button>
                )}
                <button
                  onClick={() => deleteApplication(app.job_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  ✗
                </button>
              </div>
            </div>
          ))}
          {apps.length === 0 && <p className="text-center text-gray-500">ไม่มีข้อมูล</p>}
        </div>
      </div>
    </div>
  );
  

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap -mx-4">
        {renderColumn("ผู้สมัครใหม่", applications.new, "blue")}
        {renderColumn("รอสัมภาษณ์", applications.wait, "yellow")}
        {renderColumn("ผ่านสัมภาษณ์", applications.pass, "green")}
      </div>
    </div>
  );
};

export default Job;
