import React, { useEffect, useState } from "react";
import { PlusCircle, Edit2, Trash2, X, Printer } from "lucide-react";

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
    if (!selectedItem?.salary_id) {
      setError("เกิดข้อผิดพลาด: ไม่พบ ID ของเงินเดือนที่ต้องแก้ไข");
      return;
    }

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

  const handlePrint = () => {
    const printContent = document.querySelector('#printSection');
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = `
      <style>
        @media print {
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f8f9fa; }
          .no-print { display: none; }
          body { font-size: 12px; }
          @page { size: landscape; }
        }
      </style>
      <h1 style="text-align: center; margin-bottom: 20px;">รายงานเงินเดือน</h1>
      ${printContent.innerHTML}
    `;
    
    window.print();
    document.body.innerHTML = originalContents;
    // Reattach event listeners
    window.location.reload();
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const getStatusDisplay = (status) => {
    if (status === "Paid") {
      return (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-green-700">จ่ายแล้ว</span>
        </div>
      );
    } else if (status === "Pending") {
      return (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-yellow-700">รออนุมัติ</span>
        </div>
      );
    }
    return null;
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Salary Data</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {employeeId && (
                  <button
                    onClick={() => setEmployeeId("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Printer size={20} />
                พิมพ์
              </button>

              {user?.role === "admin" && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(initialFormData);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <PlusCircle size={20} />
                  เพิ่มข้อมูล
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div id="printSection" className="overflow-x-auto">
            <div className="min-w-max">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="p-2 text-left font-medium text-gray-500 sticky left-0 bg-gray-50">
                      ข้อมูลพนักงาน
                    </th>
                    <th className="p-4 text-center font-medium text-gray-500">สถานะ</th>
                    <th className="p-4 text-center font-medium text-gray-500">ตำแหน่ง</th>
                    <th className="p-4 text-center font-medium text-gray-500">วันที่จ่าย</th>
                    <th className="p-4 text-center font-medium text-gray-500">ข้อมูลธนาคาร</th>
                    <th className="p-4 text-center font-medium text-gray-500">เงินเดือน</th>
                    <th className="p-4 text-center font-medium text-gray-500">ค่าล่วงเวลา</th>
                    <th className="p-4 text-center font-medium text-gray-500">โบนัส</th>
                    <th className="p-4 text-center font-medium text-gray-500">ขาด/สาย</th>
                    <th className="p-4 text-center font-medium text-gray-500">ค่าเบิกเงิน</th>
                    <th className="p-4 text-center font-medium text-gray-500">ภาษี</th>
                    <th className="p-4 text-center font-medium text-gray-500">กองทุน</th>
                    <th className="p-4 text-center font-medium text-gray-500">ประกันสังคม</th>
                    <th className="p-4 text-center font-medium text-gray-500">รายได้สุทธิ</th>
                    {user?.role === "admin" && (
                      <th className="p-4 text-center font-medium text-gray-500 no-print">
                        จัดการ
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {currentItems.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-4 sticky left-0 bg-white">
                        <div className="font-medium">
                          {item.firstname} {item.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {item.employee_id}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {getStatusDisplay(item.status)}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        {item.position}
                      </td>
                      <td className="p-4 text-center">
                        <div className="text-sm whitespace-nowrap">
                          <div>
                            Start: {new Date(item.payroll_startdate).toLocaleDateString("th-TH")}
                          </div>
                          <div>
                            End: {new Date(item.payroll_enddate).toLocaleDateString("th-TH")}
                          </div>
                          <div className="text-gray-500">
                            Pay: {item.payment_date
                              ? new Date(item.payment_date).toLocaleDateString("th-TH")
                              : "--/--/----"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="text-sm whitespace-nowrap">
                          <div>{item.banking}</div>
                          <div className="text-gray-500">{item.banking_id}</div>
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="font-medium text-green-500">
                          +{formatCurrency(item.salary)}
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="font-medium text-green-500">
                          +{formatCurrency(item.overtime)}
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="font-medium text-green-500">
                          +{formatCurrency(item.bonus)}
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="font-medium text-red-500">
                          -{formatCurrency(item.absent_late)}
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="font-medium text-red-500">
                          -{formatCurrency(item.expense)}
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="font-medium text-red-500">
                          -{formatCurrency(item.tax)}
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="font-medium text-red-500">
                          -{formatCurrency(item.providentfund)}
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="font-medium text-red-500">
                          -{formatCurrency(item.socialsecurity)}
                        </div>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="text-lg font-bold text-green-500">
                          {formatCurrency(item.salary_total)}
                        </div>
                      </td>
                      {user?.role === "admin" && (
                        <td className="p-4 text-center whitespace-nowrap no-print">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1 text-blue-500 hover:text-blue-700"
                            >
                              <Edit2 size={20} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(item)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-2 mt-4 no-print">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              ก่อนหน้า
            </button>

            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              ถัดไป
            </button>
          </div>

          {/* Add/Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items
-center justify-center p-4 z-50 no-print">
              <div className="bg-white rounded-lg w-full max-w-3xl">
                <div className="flex justify-between items-center p-6 border-b">
                  <h3 className="text-xl font-semibold">
                    {isEditing ? "แก้ไขข้อมูลเงินเดือน" : "เพิ่มข้อมูลเงินเดือน"}
                  </h3>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData(initialFormData);
                      setIsEditing(false);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={isEditing ? handleEdit : handleAdd} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            employee_id: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {isEditing && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          สถานะ
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Pending">รออนุมัติ</option>
                          <option value="Paid">จ่ายแล้ว</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setFormData(initialFormData);
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 no-print">
              <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">ยืนยันการลบข้อมูล</h3>
                  <p className="text-gray-600">
                    คุณต้องการลบข้อมูลเงินเดือนของ {selectedItem?.firstname}{" "}
                    {selectedItem?.lastname} ใช่หรือไม่?
                  </p>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ยืนยันการลบ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Salary;