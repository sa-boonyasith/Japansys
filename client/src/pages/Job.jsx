import React, { useState, useEffect } from "react";
import axios from "axios";
import AddJob from "./AddJob";
import { Plus, Trash2, PencilIcon, Camera } from "lucide-react";

const Job = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedApplication, setEditedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    await axios
      .get("http://localhost:8080/api/jobaplication")
      .then((response) => {
        setApplications(response.data.listjobaplication);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // ฟังก์ชันจัดรูปแบบเบอร์โทรศัพท์
    const formatPhoneNumber = (value) => {
      const cleaned = value.replace(/\D/g, "").slice(0, 10); // ลบอักขระที่ไม่ใช่ตัวเลข และจำกัด 10 ตัว
      if (cleaned.length <= 3) {
        return cleaned;
      } else if (cleaned.length <= 6) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      } else {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
          6
        )}`;
      }
    };

    setEditedApplication((prev) => {
      // ตรวจสอบว่าชื่อฟิลด์เป็น nested หรือไม่
      if (name.includes(".")) {
        const [parent, child] = name.split("."); // แยก key เป็น parent และ child
        return {
          ...prev,
          [parent]: {
            ...prev[parent], // คงค่าเดิมของ parent object
            [child]:
              child === "phone_number"
                ? formatPhoneNumber(value) // จัดรูปแบบเบอร์โทร
                : child === "age" || child === "expected_salary"
                ? value === ""
                  ? ""
                  : Number(value) // แปลงเป็นตัวเลขเฉพาะ age และ expected_salary
                : value, // อื่นๆ คงค่าเดิม
          },
        };
      } else {
        return {
          ...prev,
          [name]:
            name === "phone_number"
              ? formatPhoneNumber(value)
              : name === "age" || name === "expected_salary"
              ? value === ""
                ? ""
                : Number(value)
              : value,
        };
      }
    });
  };

  const handleEditStatus = (id, newStatus) => {
    // หา application ที่ต้องการอัพเดท
    const applicationToUpdate = applications.find((app) => app.job_id === id);

    if (!applicationToUpdate) {
      console.error("Application not found");
      return;
    }

    // ส่งข้อมูลทั้งหมดพร้อมกับ status ใหม่
    const updatedData = {
      ...applicationToUpdate,
      status: newStatus,
      expected_salary: Number(applicationToUpdate.expected_salary),
      age: Number(applicationToUpdate.age),
    };

    axios
      .put(`http://localhost:8080/api/jobaplication/${id}`, updatedData)
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

  const handleFileChange = async (e, jobId) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('photo', file);
    
    // ต้องแนบข้อมูลเดิมทั้งหมดไปด้วย
    formData.append('firstname', editedApplication.firstname);
    formData.append('lastname', editedApplication.lastname);
    formData.append('job_position', editedApplication.job_position);
    formData.append('expected_salary', editedApplication.expected_salary);
    formData.append('phone_number', editedApplication.phone_number);
    formData.append('email', editedApplication.email);
    formData.append('liveby', editedApplication.liveby);
    formData.append('birth_date', editedApplication.birth_date);
    formData.append('age', editedApplication.age);
    formData.append('ethnicity', editedApplication.ethnicity);
    formData.append('nationality', editedApplication.nationality);
    formData.append('religion', editedApplication.religion);
    formData.append('marital_status', editedApplication.marital_status);
    formData.append('military_status', editedApplication.military_status);
    formData.append('status', editedApplication.status);
    
    // แปลง personal_info เป็น string ก่อนส่ง
    if (editedApplication.personal_info) {
      formData.append('personal_info', JSON.stringify(editedApplication.personal_info));
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8080/api/jobaplication/${jobId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.status === 200) {
        // อัพเดท state
        const updatedPhoto = response.data.application.photo;
        setSelectedApplication(prev => ({
          ...prev,
          photo: updatedPhoto
        }));
        
        setEditedApplication(prev => ({
          ...prev,
          photo: updatedPhoto
        }));
  
        // รีเฟรชข้อมูล
        fetchApplications();
        
        alert('อัพโหลดรูปภาพสำเร็จ');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
    }
  };


  const handleUpdateApplication = async () => {
    try {
      if (!editedApplication) {
        alert("ไม่มีข้อมูลสำหรับอัปเดต");
        return;
      }

      const updatedData = {
        ...editedApplication,
        expected_salary: editedApplication.expected_salary
          ? Number(editedApplication.expected_salary)
          : 0,
        age: editedApplication.age ? Number(editedApplication.age) : 0,
      };

      console.log("📌 Updated Data:", updatedData);

      const response = await axios.put(
        `http://localhost:8080/api/jobaplication/${editedApplication.job_id}`,
        updatedData
      );

      if (response.status === 200) {
        fetchApplications(); // โหลดข้อมูลใหม่
        setEditMode(false);
        setIsModalOpen(false);
        alert("✅ อัปเดตข้อมูลสำเร็จ!");
      } else {
        alert("⚠️ อัปเดตข้อมูลไม่สำเร็จ");
        console.log("", error);
      }
    } catch (error) {
      console.error("❌ Error updating application:", error);
      alert("❌ เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
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
      pass: "bg-green-500 hover:bg-green-600",
    };
    return colors[status] || "bg-gray-500 hover:bg-gray-600";
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: "bg-blue-100 text-blue-800 border-blue-200",
      wait: "bg-yellow-100 text-yellow-800 border-yellow-200",
      pass: "bg-green-100 text-green-800 border-green-200",
    };
    return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ระบบจัดการผู้สมัครงาน
          </h1>
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
            <div
              key={status}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
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
                            onChange={(e) =>
                              handleEditStatus(app.job_id, e.target.value)
                            }
                            className={`text-sm rounded-lg border px-3 py-1.5 ${getStatusBadge(
                              app.status
                            )}`}
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
                      className="text-red-500 hover:text-red-700"
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
                          onChange={(e) =>
                            handleFileChange(e, selectedApplication.job_id)
                          }
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    {editMode ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ชื่อ
                              </label>
                              <input
                                type="text"
                                name="firstname"
                                value={editedApplication.firstname}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                นามสกุล
                              </label>
                              <input
                                type="text"
                                name="lastname"
                                value={editedApplication.lastname}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                อีเมล
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={editedApplication.email}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                เบอร์โทร
                              </label>
                              <input
                                type="text"
                                name="phone_number"
                                maxLength={12}
                                value={editedApplication.phone_number}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                อาศัยอยู่กับ
                              </label>
                              <select
                                name="liveby"
                                value={editedApplication.liveby}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              >
                                <option value="อาศัยกับครอบครัว">
                                  อาศัยกับครอบครัว
                                </option>
                                <option value="บ้านตัวเอง">บ้านตัวเอง</option>
                                <option value="บ้านเช่า">บ้านเช่า</option>
                                <option value="คอนโด">คอนโด</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ที่อยู่ปัจจุบัน
                              </label>
                              <input
                                type="text"
                                name="personal_info.address"
                                value={editedApplication.personal_info.address}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                จังหวัด
                              </label>
                              <input
                                type="text"
                                name="personal_info.city"
                                value={editedApplication.personal_info.city}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                รหัสไปรษณีย์
                              </label>
                              <input
                                maxLength={5}
                                type="text"
                                name="personal_info.zip_code"
                                value={editedApplication.personal_info.zip_code}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ตำแหน่ง
                              </label>
                              <input
                                type="text"
                                name="job_position"
                                value={editedApplication.job_position}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                เงินเดือนที่คาดหวัง
                              </label>
                              <input
                                type="number"
                                name="expected_salary"
                                value={editedApplication.expected_salary}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                อายุ
                              </label>
                              <input
                                type="number"
                                name="age"
                                value={editedApplication.age}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                เชื้อชาติ
                              </label>
                              <input
                                type="text"
                                name="ethnicity"
                                value={editedApplication.ethnicity}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                สัญชาติ
                              </label>
                              <input
                                type="text"
                                name="nationality"
                                value={editedApplication.nationality}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ศาสนา
                              </label>
                              <input
                                type="text"
                                name="religion"
                                value={editedApplication.religion}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                สถานภาพ
                              </label>
                              <select
                                name="marital_status"
                                value={editedApplication.marital_status}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              >
                                <option value="โสด">โสด</option>
                                <option value="สมรส">สมรส</option>
                                <option value="หย่าร้าง">หย่าร้าง</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ภาวะทางการทหาร
                              </label>
                              <select
                                name="military_status"
                                value={editedApplication.military_status}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              >
                                <option value="ได้รับการยกเว้น">
                                  ได้รับการยกเว้น
                                </option>
                                <option value="ปลดเป็นทหารกองหนุน">
                                  ปลดเป็นทหารกองหนุน
                                </option>
                                <option value="ยังไม่ได้รับการเกณฑ์">
                                  ยังไม่ได้รับการเกณฑ์
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={handleUpdateApplication}
                            className="flex-1 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
                          >
                            บันทึกการแก้ไข
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(editedApplication.job_id)
                            }
                            className="flex-1 bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition"
                          >
                            ลบข้อมูล
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-2xl font-semibold text-gray-900">
                          {selectedApplication.firstname}{" "}
                          {selectedApplication.lastname}
                        </h4>
                        <p className="text-gray-600 mt-1">
                          ตำแหน่ง: {selectedApplication.job_position}
                        </p>
                        <p className="text-gray-600 mt-1">
                          <span className="text-gray-600 mt-1">
                            เงินเดือนที่คาดหวัง:
                          </span>{" "}
                          {Number(
                            selectedApplication.expected_salary
                          ).toLocaleString()}{" "}
                          บาท/เดือน
                        </p>

                        <div className="mt-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                              selectedApplication.status
                            )}`}
                          >
                            {selectedApplication.status === "new"
                              ? "ผู้สมัครใหม่"
                              : selectedApplication.status === "wait"
                              ? "รอสัมภาษณ์"
                              : "ผ่านสัมภาษณ์"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-6 mt-6">
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-3">
                              ประวัติส่วนตัว
                            </h5>
                            <div className="space-y-2 text-gray-600">
                              <p>
                                <span className="font-medium">อีเมล:</span>{" "}
                                {selectedApplication.email}
                              </p>
                              <p>
                                <span className="font-medium">เบอร์โทร:</span>{" "}
                                {selectedApplication.phone_number}
                              </p>
                              <p>
                                <span className="font-medium">
                                  อาศัยอยู่กับ
                                </span>{" "}
                                {selectedApplication.liveby}
                              </p>
                              <p>
                                <span className="font-medium">
                                  ที่อยู่ปัจจุบัน:
                                </span>{" "}
                                {selectedApplication.personal_info.address}
                              </p>
                              <p>
                                <span className="font-medium">จังหวัด:</span>{" "}
                                {selectedApplication.personal_info.city}
                              </p>
                              <p>
                                <span className="font-medium">
                                  รหัสไปรษณีย์:
                                </span>{" "}
                                {selectedApplication.personal_info.zip_code}
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="space-y-2 text-gray-600 mt-9">
                              <p>
                                <span className="font-medium">อายุ:</span>{" "}
                                {selectedApplication.age} ปี
                              </p>
                              <p>
                                <span className="font-medium">
                                  วัน/เดือน/ปีเกิด:
                                </span>{" "}
                                {new Date(
                                  selectedApplication.birth_date
                                ).toLocaleDateString("th-TH")}
                              </p>
                              <p>
                                <span className="font-medium">เชื้อชาติ</span>{" "}
                                {selectedApplication.ethnicity}
                              </p>
                              <p>
                                <span className="font-medium">สัญชาติ</span>{" "}
                                {selectedApplication.nationality}
                              </p>
                              <p>
                                <span className="font-medium">ศาสนา</span>{" "}
                                {selectedApplication.religion}
                              </p>
                              <p>
                                <span className="font-medium">สถานภาพ:</span>{" "}
                                {selectedApplication.marital_status}
                              </p>
                              <p>
                                <span className="font-medium">
                                  ภาวะทางการทหาร:
                                </span>{" "}
                                {selectedApplication.military_status}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {addModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-[1000px] max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    เพิ่มข้อมูล
                  </h3>
                  <button
                    onClick={() => setAddModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <AddJob
                  onSuccess={() => {
                    setAddModalOpen(false);
                    fetchApplications();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Job;
