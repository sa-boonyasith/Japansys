import React, { useState, useEffect } from "react";
import axios from "axios";
import Test2 from "./Test2";

const Test = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addModalOpen,setAddModalOpen] = useState(false)

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/jobaplication")
      .then((response) => {
        setApplications(response.data.listjobaplication);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []);

  const handleEditStatus = (id, newStatus) => {
    axios
      .put(`http://localhost:8080/api/jobaplication/${id}`, {
        status: newStatus,
      })
      .then(() => {
        // ดึงข้อมูลใหม่
        return axios.get("http://localhost:8080/api/jobaplication");
      })
      .then((response) => {
        setApplications(response.data.listjobaplication);
      })
      .catch((error) => {
        console.error("Error updating or fetching applications:", error);
        alert("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/jobaplication/${id}`)
      .then(() => {
        setApplications((prev) => prev.filter((app) => app.job_id !== id));
      })
      .catch((error) => {
        console.error("Error deleting application:", error);
      });
  };

  const filterByStatus = (status) =>
    applications.filter((app) => app.status === status);

  const handleViewDetails = (app) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = ()=>{
    setAddModalOpen(true)
  }
  const handleCloseAddModal = ()=>{
    setAddModalOpen(false)
  }


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const renderDocuments = (documents) => {
    const documentList = [
      { label: "บัตรประชาชน", value: documents.id_card },
      { label: "ทะเบียนบ้าน", value: documents.house_registration },
      { label: "วุฒิการศึกษา", value: documents.certificate },
      { label: "สลิปเงินเดือน", value: documents.bank_statement },
      { label: "เอกสารอื่นๆ", value: documents.other },
    ];

    return (
      <ul className="list-none">
        {documentList.map((doc, index) => (
          <li key={index} className="flex items-center">
            <input
              type="checkbox"
              checked={doc.value}
              readOnly
              className="mr-2"
            />
            {doc.label}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">ระบบจัดการผู้สมัครงาน</h1>
      <div className="">
      <button 
      onClick={handleOpenAddModal}
      className="ml-[1410px] mb-3 bg-green-500 text-white px-6 py-2  rounded-md shadow-md">
      +
    </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["new", "wait", "pass"].map((status) => (
          <div key={status} className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              {status === "new" && "ผู้สมัครใหม่"}
              {status === "wait" && "รอสัมภาษณ์"}
              {status === "pass" && "ผ่านสัมภาษณ์"}
            </h2>
            <ul>
              {filterByStatus(status).map((app) => (
                <li
                  key={app.job_id}
                  className="flex items-center  justify-between mb-2"
                >
                  <div>
                    <p
                      className="font-medium cursor-pointer text-blue-500"
                      onClick={() => handleViewDetails(app)}
                    >
                      {app.firstname} {app.lastname}
                    </p>
                    <p className="text-sm text-gray-600">
                      ตำแหน่ง: {app.job_position}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleEditStatus(app.job_id, e.target.value)
                      }
                      className="p-1 text-sm border rounded-md"
                    >
                      <option value="new">ใหม่</option>
                      <option value="wait">รอสัมภาษณ์</option>
                      <option value="pass">ผ่านสัมภาษณ์</option>
                    </select>
                    <button
                      onClick={() => handleDelete(app.job_id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                    >
                      ลบ
                    </button>
                  </div>
                </li>
              ))}
              {filterByStatus(status).length === 0 && (
                <p className="text-sm text-gray-500">ไม่มีข้อมูล</p>
              )}
            </ul>
          </div>
        ))}
      </div>

      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[1000px] overflow-y-auto max-h-[500px]">
            <h3 className="text-xl font-semibold mb-4">เพิ่มข้อมูล</h3>
            <Test2/>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseAddModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
        



      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
            <h3 className="text-xl font-semibold mb-4">รายละเอียดผู้สมัคร</h3>
            <img
              src={`http://localhost:8080${selectedApplication.photo}`}
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4"
            />

            <p>
              <strong>สถานะ:</strong>{" "}
              {selectedApplication.status === "new"
                ? "ผู้สมัครใหม่"
                : selectedApplication.status === "wait"
                ? "รอสัมภาษณ์"
                : "ผ่านสัมภาษณ์"}
            </p>
            <p>
              <strong>ชื่อ:</strong> {selectedApplication.firstname}{" "}
              {selectedApplication.lastname}
            </p>
            <p>
              <strong>ตำแหน่งที่สมัคร:</strong>{" "}
              {selectedApplication.job_position}
            </p>
            <p>
              <strong>เงินเดือนที่คาดหวัง:</strong>{" "}
              {selectedApplication.expected_salary} บาท/เดือน
            </p>
            <p>
              <strong>เอกสารที่ใช้ประกอบการสมัครงาน:</strong>
            </p>
            {renderDocuments(selectedApplication.documents)}
            <b>Personal Information (ประวัติส่วนตัว)</b>
            <p>
              <strong>ที่อยู่ปัจจุบัน : </strong>{" "}
              {selectedApplication.personal_info.address}
            </p>
            <p>
              <strong>ประเทศ : </strong>
              {selectedApplication.personal_info.city}
            </p>
            <p>
              <strong>รหัสไปรษณีย์ : </strong>
              {selectedApplication.personal_info.zip_code}
            </p>
            <p>
              <strong>อีเมล:</strong> {selectedApplication.email}
            </p>
            <p>
              <strong>เบอร์โทร:</strong> {selectedApplication.phone_number}
            </p>
            <p>
              <strong>วัน/เดือน/ปีเกิด: </strong>
              {selectedApplication.birth_date}
            </p>
            <p>
              <strong>อายุ:</strong> {selectedApplication.age} ปี
            </p>
            <p>
              <strong>เชื้อชาติ :</strong>
              {selectedApplication.ethnicity}
            </p>
            <p>
              <strong>ศาสนา:</strong> {selectedApplication.religion}
            </p>
            <p>
              <strong>สถานะทางทหาร:</strong>{" "}
              {selectedApplication.military_status}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
