import React, { useState, useEffect } from "react";
import axios from "axios";
import AddJob from "./AddJob";
import { Plus, Trash2, PencilIcon, Camera } from "lucide-react";

const Job = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedApplication, setEditedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    axios
      .get("http://localhost:8080/api/jobaplication")
      .then((response) => {
        setApplications(response.data.listjobaplication);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  };

  const handleEdit = (application) => {
    setEditedApplication({
      ...application,
      expected_salary: application.expected_salary.toString(),
      age: application.age.toString(),
    });
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedApplication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditStatus = (id, newStatus) => {
    axios
      .put(`http://localhost:8080/api/jobaplication/${id}`, {
        status: newStatus,
      })
      .then(() => {
        fetchApplications();
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        alert("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("คุณต้องการลบข้อมูลผู้สมัครนี้ใช่หรือไม่?")) {
      axios
        .delete(`http://localhost:8080/api/jobaplication/${id}`)
        .then(() => {
          setApplications((prev) => prev.filter((app) => app.job_id !== id));
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting application:", error);
        });
    }
  };

  const handleImageChange = async (event, applicationId) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await axios.put(`http://localhost:8080/api/jobaplication/${applicationId}/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchApplications();
    } catch (error) {
      console.error("Error updating photo:", error);
      alert("เกิดข้อผิดพลาด ในการอัพโหลดรูปภาพ");
    }
  };

  const handleUpdateApplication = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/jobaplication/${editedApplication.job_id}`,
        editedApplication
      );
      
      if (response.status === 200) {
        fetchApplications();
        setEditMode(false);
        setIsModalOpen(false);
        alert("อัพเดทข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      alert("เกิดข้อผิดพลาด ในการอัพเดทข้อมูล");
    }
  };

  const filterByStatus = (status) =>
    applications.filter((app) => app.status === status);

  const handleViewDetails = (app) => {
    setSelectedApplication(app);
    setEditedApplication(app);
    setIsModalOpen(true);
    setEditMode(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-500 hover:bg-blue-600",
      wait: "bg-yellow-500 hover:bg-yellow-600",
      pass: "bg-green-500 hover:bg-green-600"
    };
    return colors[status] || "bg-gray-500 hover:bg-gray-600";
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: "bg-blue-100 text-blue-800 border-blue-200",
      wait: "bg-yellow-100 text-yellow-800 border-yellow-200",
      pass: "bg-green-100 text-green-800 border-green-200"
    };
    return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ระบบจัดการผู้สมัครงาน</h1>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            <span>เพิ่มผู้สมัคร</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["new", "wait", "pass"].map((status) => (
            <div key={status} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className={`p-4 ${getStatusColor(status)} rounded-t-xl`}>
                <h2 className="text-xl font-semibold text-white">
                  {status === "new" && "ผู้สมัครใหม่"}
                  {status === "wait" && "รอสัมภาษณ์"}
                  {status === "pass" && "ผ่านสัมภาษณ์"}
                  <span className="ml-2 text-sm font-normal text-white opacity-80">
                    ({filterByStatus(status).length})
                  </span>
                </h2>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  {filterByStatus(status).map((app) => (
                    <li
                      key={app.job_id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={`http://localhost:8080${app.photo}`}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p
                              className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                              onClick={() => handleViewDetails(app)}
                            >
                              {app.firstname} {app.lastname}
                            </p>
                            <p className="text-sm text-gray-600">
                              ตำแหน่ง: {app.job_position}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={app.status}
                            onChange={(e) => handleEditStatus(app.job_id, e.target.value)}
                            className={`text-sm rounded-lg border px-3 py-1.5 ${getStatusBadge(app.status)}`}
                          >
                            <option value="new">ใหม่</option>
                            <option value="wait">รอสัมภาษณ์</option>
                            <option value="pass">ผ่านสัมภาษณ์</option>
                          </select>
                        </div>
                      </div>
                    </li>
                  ))}
                  {filterByStatus(status).length === 0 && (
                    <li className="text-center py-8">
                      <p className="text-gray-500">ไม่มีข้อมูล</p>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[800px] max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editMode ? "แก้ไขข้อมูลผู้สมัคร" : "รายละเอียดผู้สมัคร"}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditMode(false);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-6 mb-6">
                  <div className="relative group">
                    <img
                      src={`http://localhost:8080${selectedApplication.photo}`}
                      alt="Profile"
                      className="w-32 h-32 rounded-lg object-cover border border-gray-200"
                    />
                    {editMode && (
                      <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-lg cursor-pointer transition">
                        <Camera className="text-white" size={24} />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, selectedApplication.job_id)}
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    {editMode ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editedApplication.firstname}
                          onChange={(e) => setEditedApplication({
                            ...editedApplication,
                            firstname: e.target.value
                          })}
                          className="block w-full rounded-lg border-gray-300"
                        />
                        <input
                          type="text"
                          value={editedApplication.lastname}
                          onChange={(e) => setEditedApplication({
                            ...editedApplication,
                            lastname: e.target.value
                          })}
                          className="block w-full rounded-lg border-gray-300"
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="text-2xl font-semibold text-gray-900">
                          {selectedApplication.firstname} {selectedApplication.lastname}
                        </h4>
                        <p className="text-gray-600 mt-1">
                          ตำแหน่ง: {selectedApplication.job_position}
                        </p>
                      </>
                    )}
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedApplication.status)}`}>
                        {selectedApplication.status === "new"
                          ? "ผู้สมัครใหม่"
                          : selectedApplication.status === "wait"
                          ? "รอสัมภาษณ์"
                          : "ผ่านสัมภาษณ์"}
                      </span>
                    </div>
                  </div>
                </div>

                {editMode ? (
                  <div className="space-y-4">
                    <button
                      onClick={handleUpdateApplication}
                      className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
                    >
                      บันทึกการแก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(selectedApplication.job_id)}
                      className="w-full bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition"
                    >
                      ลบข้อมูล
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">ข้อมูลการติดต่อ</h5>
                      <div className="space-y-2 text-gray-600">
                        <p><span className="font-medium">อีเมล:</span> {selectedApplication.email}</p>
                        <p><span className="font-medium">เบอร์โทร:</span> {selectedApplication.phone_number}</p>
                        <p><span className="font-medium">เงินเดือนที่คาดหวัง:</span> {selectedApplication.expected_salary} บาท/เดือน</p>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">ข้อมูลส่วนตัว</h5>
                      <div className="space-y-2 text-gray-600">
                        <p><span className="font-medium">อายุ:</span> {selectedApplication.age} ปี</p>
                        <p><span className="font-medium">สถานภาพ:</span> {selectedApplication.marital_status}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {addModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[1000px] max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">เพิ่มข้อมูล</h3>
                  <button
                    onClick={() => setAddModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <AddJob onSuccess={() => {
                  setAddModalOpen(false);
                  fetchApplications();
                }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Job;