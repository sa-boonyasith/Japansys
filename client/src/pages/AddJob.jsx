import React, { useState } from "react";
import axios from "axios";

const AddJob = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    job_position: "",
    expected_salary: "",
    age: "",
    phone_number: "",
    email: "",
    liveby: "",
    birth_date: "",
    ethnicity: "",
    nationality: "",
    religion: "",
    marital_status: "",
    military_status: "",
    banking:"",
    banking_id:"",
    documents: {
      id_card: false,
      house_registration: false,
      certificate: false,
      bank_statement: false,
      other: false,
    },
    personal_info: {
      address: "",
      city: "",
      zip_code: "",
    },
  });

  const [fileUploads, setFileUploads] = useState({
    id_card: null,
    house_registration: null,
    certificate: null,
    bank_statement: null,
    other: null,
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone_number") {
      const numericValue = value.replace(/\D/g, "");
      const limitedValue = numericValue.slice(0, 10);
      const formattedValue = limitedValue.replace(
        /(\d{3})(\d{3})(\d{0,4})/,
        (_, p1, p2, p3) => `${p1}-${p2}${p3 ? `-${p3}` : ""}`
      );
      setFormData((prev) => ({ ...prev, phone_number: formattedValue }));
    } else if (name === "expected_salary") {
      const numericValue = value.replace(/\D/g, "");
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setFormData((prev) => ({ ...prev, expected_salary: formattedValue }));
    } else if (name === "personal_info.zip_code") {
      const numericValue = value.replace(/\D/g, "").slice(0, 5);
      setFormData((prev) => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          zip_code: numericValue,
        },
      }));
    } else if (name.startsWith("personal_info.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFileUploads((prev) => ({
      ...prev,
      [name]: file,
    }));
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [name]: !!file,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "expected_salary" || key === "age") {
        // แปลง expected_salary และ age เป็นตัวเลขก่อนส่งไป backend
        const numericValue = Number(String(value).replace(/,/g, ""));
        formDataToSend.append(key, numericValue);
      } else if (typeof value === "object" && value !== null) {
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, value);
      }
    });

    Object.entries(fileUploads).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file);
      }
    });

    try {
      await axios.post(
        "http://localhost:8080/api/jobaplication",
        formDataToSend
      );
      alert("เพิ่มผู้สมัครสำเร็จ!");

      setFormData({
        firstname: "",
        lastname: "",
        job_position: "",
        expected_salary: "",
        age: "",
        phone_number: "",
        email: "",
        liveby: "",
        birth_date: "",
        ethnicity: "",
        nationality: "",
        religion: "",
        marital_status: "",
        military_status: "",
        banking:"",
        banking_id:"",
        documents: {
          id_card: false,
          house_registration: false,
          certificate: false,
          bank_statement: false,
          other: false,
        },
        personal_info: {
          address: "",
          city: "",
          zip_code: "",
        },
      });

      setFileUploads({
        id_card: null,
        house_registration: null,
        certificate: null,
        bank_statement: null,
        other: null,
        photo: null,
      });
    } catch (error) {
      console.error(
        "Error adding application:",
        error.response?.data || error.message
      );
      alert(
        "เกิดข้อผิดพลาด: " + (error.response?.data?.message || "ไม่ทราบสาเหตุ")
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="bg-gray-50 p-6 rounded-t-lg border-b">
          <h1 className="text-3xl font-bold text-gray-800">แบบฟอร์มสมัครงาน</h1>
          <p className="text-gray-600 mt-2">กรุณากรอกข้อมูลให้ครบถ้วน</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* ข้อมูลการสมัครงาน */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
              ข้อมูลการสมัครงาน
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ตำแหน่งที่สมัคร
                </label>
                <input
                  type="text"
                  name="job_position"
                  value={formData.job_position}
                  onChange={handleChange}
                  required
                  placeholder="Developer"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เงินเดือนที่คาดหวัง
                </label>
                <input
                  type="text" // เปลี่ยนจาก type="number" เป็น type="text"
                  name="expected_salary"
                  value={formData.expected_salary} // ใช้ฟังก์ชัน formatSalary เพื่อแสดงผล
                  onChange={handleChange}
                  required
                  placeholder="xxx,xxx"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลส่วนตัว */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
              ข้อมูลส่วนตัว
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  placeholder="ชื่อ"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  นามสกุล
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  placeholder="นามสกุล"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@email.com"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  placeholder="087-000-0000"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  วันเกิด
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อายุ
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  placeholder="25"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เชื้อชาติ
                </label>
                <input
                  type="text"
                  name="ethnicity"
                  value={formData.ethnicity}
                  onChange={handleChange}
                  required
                  placeholder="ไทย"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  สัญชาติ
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                  placeholder="ไทย"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ศาสนา
                </label>
                <select
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">เลือกศาสนา</option>
                  <option value="พุทธ">พุทธ</option>
                  <option value="คริสต์">คริสต์</option>
                  <option value="อิสลาม">อิสลาม</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อธนาคาร
                </label>
                <input
                  type="text"
                  name="banking"
                  value={formData.banking}
                  onChange={handleChange}
                  required
                  placeholder="ชื่อธนาคาร"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หมายเลขธนาคาร
                </label>
                <input
                  type="text"
                  name="banking_id"
                  value={formData.banking_id}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // กรองเฉพาะตัวเลข
                  }}
                  required
                  pattern="\d{10}"
                  maxLength={10}
                  placeholder="หมายเลขธนาคาร (10 หลัก)"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลที่อยู่ */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
              ข้อมูลที่อยู่
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ที่อยู่ปัจจุบัน
                </label>
                <input
                  type="text"
                  name="personal_info.address"
                  value={formData.personal_info.address}
                  onChange={handleChange}
                  required
                  placeholder="เลขที่ ซอย ถนน"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อาศัยอยู่กับ
                </label>
                <select
                  name="liveby"
                  value={formData.liveby}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">เลือกประเภทที่พักอาศัย</option>
                  <option value="อยู่กับครอบครัว">อยู่กับครอบครัว</option>
                  <option value="บ้านตัวเอง">บ้านตัวเอง</option>
                  <option value="บ้านเช่า">บ้านเช่า</option>
                  <option value="คอนโด">คอนโด</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  จังหวัด
                </label>
                <input
                  type="text"
                  name="personal_info.city"
                  value={formData.personal_info.city}
                  onChange={handleChange}
                  required
                  placeholder="กรุงเทพมหานคร"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสไปรษณีย์
                </label>
                <input
                  type="number"
                  name="personal_info.zip_code"
                  value={formData.personal_info.zip_code}
                  onChange={handleChange}
                  required
                  placeholder="10400"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* สถานภาพและการเกณฑ์ทหาร */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
              สถานภาพและการเกณฑ์ทหาร
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  สถานภาพ
                </label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">เลือกสถานภาพ</option>
                  <option value="โสด">โสด</option>
                  <option value="แต่งงาน">แต่งงาน</option>
                  <option value="หย่าร้าง">หย่าร้าง</option>
                  <option value="หม้าย">หม้าย</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  สถานะทางทหาร
                </label>
                <select
                  name="military_status"
                  value={formData.military_status}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">เลือกสถานะทางทหาร</option>
                  <option value="ได้รับการยกเว้น">ได้รับการยกเว้น</option>
                  <option value="ปลดเป็นทหารกองหนุน">ปลดเป็นทหารกองหนุน</option>
                  <option value="ยังไม่ได้รับการเกณฑ์">
                    ยังไม่ได้รับการเกณฑ์
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* เอกสารประกอบการสมัคร */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
              เอกสารประกอบการสมัคร
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รูปถ่าย
                </label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* ปุ่มส่งฟอร์ม */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              ส่งใบสมัคร
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
