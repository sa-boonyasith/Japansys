import React, { useState } from "react";
import axios from "axios";

const AddJobApplication = () => {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        [name]: !!file, // ถ้ามีไฟล์ให้เป็น true
      },
    }));
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // เพิ่มข้อมูลทั่วไปใน FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "object") {
        formDataToSend.append(key, JSON.stringify(value)); // แปลง object เป็น string
      } else {
        formDataToSend.append(key, value);
      }
    });

    // เพิ่มไฟล์ใน FormData
    Object.entries(fileUploads).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/jobaplication",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("เพิ่มผู้สมัครสำเร็จ!");
      // รีเซ็ตฟอร์ม
      setFormData({
        firstname: "",
        lastname: "",
        job_position: "",
        expected_salary: "",
        age : "",
        phone_number: "",
        email: "",
        liveby: "",
        birth_date: "",
        ethnicity: "",
        nationality: "",
        religion: "",
        marital_status: "",
        military_status: "",
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
      console.error("Error adding application:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">เพิ่มข้อมูลผู้สมัคร</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">ชื่อ</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              placeholder="อัศวิน"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">นามสกุล</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              placeholder="รัตติกาล"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ตำแหน่งที่ต้องการ</label>
            <input
              type="text"
              name="job_position"
              placeholder="นอนทั้งวัน"
              value={formData.job_position}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">อีเมล</label>
            <input
              type="text"
              name="email"
              placeholder="เมลโง่@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">เบอโทรศัพท์</label>
            <input
              type="text"
              name="phone_number]"
              placeholder="087เป็ดเย็ดไก่"
              value={formData.phone_number}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">วัน/เดือน/ปี</label>
            <input
              type="text"
              name="birth_date]"
              value={formData.birth_date}
              onChange={handleChange}
              placeholder="02/12/2000"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">อายุ</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="18มาเป็นสาวรำวง"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">เชื้อชาติ</label>
            <input
              type="text"
              name="age"
              value={formData.ethnicity}
              onChange={handleChange}
              placeholder="เกาเหลา"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">สัญชาติ</label>
            <input
              type="text"
              name="age"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="เกาเหลา"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ศาสนา</label>
            <input
              type="text"
              name="age"
              value={formData.religion}
              onChange={handleChange}
              placeholder="Jesus"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">ที่อยู่ปัจจุบัน</label>
            <input
              type="text"
              name="address"
              value={formData.personal_info.address}
              placeholder="ดงแฮ ซอย 9"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">อาศัย</label>
            <input
              type="text"
              name="age"
              value={formData.liveby}
              onChange={handleChange}
              placeholder="อยู่กับครอบครัว,คอนโด,บ้านเช่า,บ้านตัวเอง"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ประเทศ</label>
            <input
              type="text"
              name="city"
              value={formData.personal_info.city}
              placeholder="เกาเหลา"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ไปรษณีย์</label>
            <input
              type="text"
              name="zip_code"
              value={formData.personal_info.zip_code}
              placeholder="11111"
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          



        </div>

        <div>
          <label className="block text-sm font-medium">เอกสารที่เกี่ยวข้อง</label>
          <div className="space-y-2">
            {["id_card", "house_registration", "certificate", "bank_statement", "other"].map(
              (doc) => (
                <div key={doc}>
                  <label className="block text-sm font-medium capitalize">
                    {doc.replace("_", " ")}
                  </label>
                  <input
                    type="file"
                    name={doc}
                    onChange={handleFileChange}
                    className="p-2"
                  />
                </div>
              )
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">รูปภาพ (โปรไฟล์)</label>
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            className="p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          เพิ่มข้อมูล
        </button>
      </form>
    </div>
  );
};

export default AddJobApplication;
