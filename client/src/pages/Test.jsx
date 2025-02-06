import React, { useEffect, useState } from "react";
import { PlusCircle, Edit2, Trash2, X } from "lucide-react";

const Salary = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 4;

  const initialFormData = {
    employee_id: "",
    firstname: "",
    lastname: "",
    position: "",
    banking: "",
    banking_id: "",
    salary: 0,
    overtime: 0,
    bonus: 0,
    absent_late: 0,
    expense: 0,
    tax: 0,
    providentfund: 0,
    socialsecurity: 0,
    status: "Pending",
    payroll_startdate: "",
    payroll_enddate: "",
    payment_date: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const months = [
    { value: "01", label: "มกราคม" },
    { value: "02", label: "กุมภาพันธ์" },
    { value: "03", label: "มีนาคม" },
    { value: "04", label: "เมษายน" },
    { value: "05", label: "พฤษภาคม" },
    { value: "06", label: "มิถุนายน" },
    { value: "07", label: "กรกฎาคม" },
    { value: "08", label: "สิงหาคม" },
    { value: "09", label: "กันยายน" },
    { value: "10", label: "ตุลาคม" },
    { value: "11", label: "พฤศจิกายน" },
    { value: "12", label: "ธันวาคม" },
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  // Fetch Data
  const fetchSalaryData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/salary");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSalaryData(data.listSalary);
      setFilteredItems(data.listSalary);
    } catch (err) {
      setError("Failed to fetch salary data.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSalaryData();
  }, []);

  // CRUD Operations
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/salary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add salary record");

      await fetchSalaryData();
      setIsModalOpen(false);
      setFormData(initialFormData);
    } catch (err) {
      setError("Failed to add salary record.");
      console.error(err);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/api/salary/${selectedItem.salary_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update salary record");

      await fetchSalaryData();
      setIsModalOpen(false);
      setSelectedItem(null);
      setFormData(initialFormData);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update salary record.");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/salary/${selectedItem.salary_id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete salary record");

      await fetchSalaryData();
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (err) {
      setError("Failed to delete salary record.");
      console.error(err);
    }
  };

  useEffect(() => {
    let filtered = [...salaryData];

    if (employeeId) {
      filtered = filtered.filter((item) =>
        item.employee_id.toString().includes(employeeId.trim())
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter((item) => {
        const payrollMonth = new Date(item.payroll_startdate).getMonth() + 1;
        return payrollMonth.toString().padStart(2, "0") === selectedMonth;
      });
    }

    if (selectedYear) {
      filtered = filtered.filter((item) => {
        const payrollYear = new Date(item.payroll_startdate).getFullYear();
        return payrollYear === selectedYear;
      });
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [employeeId, selectedMonth, selectedYear, salaryData]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Salary Data</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="">เลือกเดือน</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year + 543}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <input
                    type="number"
                    placeholder="ใส่รหัสพนักงาน..."
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  {employeeId && (
                    <button
                      onClick={() => setEmployeeId("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(initialFormData);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle size={20} />
                  เพิ่มข้อมูล
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-left font-semibold text-gray-600">ข้อมูลพนักงาน</th>
                  <th className="p-4 text-center font-semibold text-gray-600">สถานะ</th>
                  <th className="p-4 text-center font-semibold text-gray-600">ตำแหน่ง</th>
                  <th className="p-4 text-center font-semibold text-gray-600">วันที่จ่าย</th>
                  <th className="p-4 text-center font-semibold text-gray-600">ข้อมูลธนาคาร</th>
                  <th className="p-4 text-center font-semibold text-gray-600">เงินเดือน</th>
                  <th className="p-4 text-center font-semibold text-gray-600">ค่าล่วงเวลา</th>
                  <th className="p-4 text-center font-semibold text-gray-600">โบนัส</th>
                  <th className="p-4 text-center font-semibold text-gray-600">ขาด/สาย</th>
                  <th className="p-4 text-center font-semibold text-gray-600">ค่าเบิกเงิน</th>
                  <th className="p-4 text-center font-semibold text-gray-600">ภาษี</th>
                  <th className="p-4 text-center font-semibold text-gray-600">กองทุน</th>
                  <th className="p-4 text-center font-semibold text-gray-600">ประกันสังคม</th>
                  <th className="p-4 text-center font-semibold text-gray-600">รายได้สุทธิ</th>
                  <th className="p-4 text-center font-semibold text-gray-600">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-800">
                        {item.firstname} {item.lastname}
                      </div>
                      <div className="text-sm text-gray-500">ID: {item.employee_id}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status === "Paid" ? "จ่ายแล้ว" : "รออนุมัติ"}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-800">{item.position}</td>
                    <td className="p-4 text-center">
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">
                          {new Date(item.payroll_startdate).toLocaleDateString("th-TH")}
                        </div>
                        <div className="text-gray-500">
                          ถึง {new Date(item.payroll_enddate).toLocaleDateString("th-TH")}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">{item.banking}</div>
                        <div className="text-gray-500">{item.banking_id}</div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium text

-green-600">
                        {formatCurrency(item.salary)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium text-green-600">
                        {formatCurrency(item.overtime)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium text-green-600">
                        {formatCurrency(item.bonus)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium text-red-600">
                        -{formatCurrency(item.absent_late)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium text-red-600">
                        -{formatCurrency(item.expense)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium text-red-600">
                        -{formatCurrency(item.tax)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium text-red-600">
                        -{formatCurrency(item.providentfund)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium text-red-600">
                        -{formatCurrency(item.socialsecurity)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(item.salary_total)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setFormData(item);
                            setIsEditing(true);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              ก่อนหน้า
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {isEditing ? "แก้ไขข้อมูลเงินเดือน" : "เพิ่มข้อมูลเงินเดือน"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData(initialFormData);
                  setIsEditing(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={isEditing ? handleEdit : handleAdd} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รหัสพนักงาน
                  </label>
                  <input
                    type="text"
                    value={formData.employee_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employee_id: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    โบนัส
                  </label>
                  <input
                    type="number"
                    value={formData.bonus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bonus: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เลือกเดือน
                  </label>
                  <input
                    type="month"
                    defaultValue={
                      formData.payroll_startdate
                        ? `${new Date(formData.payroll_startdate).getFullYear()}-${(
                            new Date(formData.payroll_startdate).getMonth() + 1
                          )
                            .toString()
                            .padStart(2, "0")}`
                        : ""
                    }
                    onChange={(e) => {
                      const selectedMonth = e.target.value;
                      const [year, month] = selectedMonth.split("-").map(Number);
                      const startDate = `${selectedMonth}-01`;
                      const endDate = new Date(year, month, 0);

                      setFormData({
                        ...formData,
                        payroll_startdate: startDate,
                        payroll_enddate: `${year}-${String(month).padStart(2, "0")}-${endDate.getDate()}`,
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      สถานะ
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="Pending">รออนุมัติ</option>
                      <option value="Paid">จ่ายแล้ว</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData(initialFormData);
                    setIsEditing(false);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isEditing ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ยืนยันการลบข้อมูล
              </h3>
              <p className="text-gray-600">
                คุณต้องการลบข้อมูลเงินเดือนของ {selectedItem?.firstname}{" "}
                {selectedItem?.lastname} ใช่หรือไม่?
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  ยืนยันการลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salary;