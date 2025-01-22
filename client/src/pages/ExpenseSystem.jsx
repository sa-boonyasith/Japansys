import React, { useState } from 'react';
import { Calendar, Upload, DollarSign, FileText, Building2, User } from 'lucide-react';

const ExpenseSystem = () => {
  const [files, setFiles] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
          <h1 className="text-3xl font-bold text-white text-center">ระบบเบิกค่าใช้จ่าย</h1>
          <p className="text-blue-100 text-center mt-2">กรอกข้อมูลด้านล่างเพื่อทำการเบิกค่าใช้จ่าย</p>
        </div>

        {/* Main Form */}
        <div className="p-8">
          <form className="space-y-8">
            {/* Employee Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  รหัสพนักงาน
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="กรอกรหัสพนักงาน"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  แผนก
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="กรอกแผนก"
                />
              </div>
            </div>

            {/* Expense Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">รายละเอียดค่าใช้จ่าย</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    วันที่ใช้จ่าย
                  </label>
                  <input 
                    type="date"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    ประเภทค่าใช้จ่าย
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option value="">เลือกประเภท</option>
                    <option value="travel">ค่าเดินทาง</option>
                    <option value="accommodation">ค่าที่พัก</option>
                    <option value="food">ค่าอาหาร</option>
                    <option value="office">ค่าอุปกรณ์สำนักงาน</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  จำนวนเงิน
                </label>
                <input 
                  type="number"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  รายละเอียด
                </label>
                <textarea 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-24"
                  placeholder="กรอกรายละเอียดค่าใช้จ่าย"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">แนบเอกสาร</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                <Upload className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                <input
                  type="file"
                  className="hidden"
                  id="fileUpload"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                />
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
                >
                  คลิกเพื่ออัพโหลดไฟล์
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  รองรับไฟล์ PDF, JPEG, PNG (ไม่เกิน 5MB)
                </p>
                {files.length > 0 && (
                  <div className="mt-4 text-left">
                    <p className="text-sm font-medium">ไฟล์ที่แนบ:</p>
                    <ul className="list-disc list-inside">
                      {files.map((file, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                ส่งคำขอเบิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSystem;