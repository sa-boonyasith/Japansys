import React, { useEffect, useState } from "react";
import { PlusCircle, Edit2, Trash2, X, Search, Calendar, UserCircle, Download } from "lucide-react";

const Salary = ({ user }) => {
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
  const itemsPerPage = 5;

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

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

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
        headers: { "Content-Type": "application/json" },
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
      setError("Error: Cannot find salary ID");
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
        { method: "DELETE" }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const styles = status === "Paid" 
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles} border`}>
        {status === "Paid" ? "จ่ายแล้ว" : "รออนุมัติ"}
      </span>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Salary Management</h1>
                <p className="text-gray-500">จัดการข้อมูลเงินเดือนพนักงาน</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(initialFormData);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <PlusCircle className="w-4 h-4" />
                เพิ่มข้อมูล
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                placeholder="ค้นหารหัสพนักงาน..."
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">เลือกเดือน</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year + 543}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">พนักงาน</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">สถานะ</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">เงินเดือน</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">รายได้เพิ่มเติม</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">รายการหัก</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">รายได้สุทธิ</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                  <tr key={item.salary_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <UserCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{`${item.firstname} ${item.lastname}`}</div>
                          <div className="text-sm text-gray-500">ID: {item.employee_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-900">
                      {formatCurrency(item.salary)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm text-center">
                        <div className="text-green-600">+ OT: {formatCurrency(item.overtime)}</div>
                        <div className="text-green-600">+ โบนัส: {formatCurrency(item.bonus)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm text-center">
                        <div className="text-red-600">- ภาษี: {formatCurrency(item.tax)}</div>
                        <div className="text-red-600">- กองทุน: {formatCurrency(item.providentfund)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(item.salary_total)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setFormData(item);
                            setIsEditing(true);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-500">
              แสดง {(currentPage - 1) * itemsPerPage + 1} ถึง{" "}
              {Math.min(currentPage * itemsPerPage, filteredItems.length)} จาก{" "}
              {filteredItems.length} รายการ
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                         border border-gray-200 hover:bg-gray-50"
              >
                ก่อนหน้า
              </button>
              {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    currentPage === idx + 1
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                className="px-3 py-1 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
                         border border-gray-200 hover:bg-gray-50"
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {isEditing ? "แก้ไขข้อมูลเงินเดือน" : "เพิ่มข้อมูลเงินเดือน"}
                  </h3>
                  <p className="text-sm text-gray-500">กรอกข้อมูลให้ครบถ้วน</p>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData(initialFormData);
                    setIsEditing(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
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
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อ
                    </label>
                    <input
                      type="text"
                      value={formData.firstname}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstname: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      นามสกุล
                    </label>
                    <input
                      type="text"
                      value={formData.lastname}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastname: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ตำแหน่ง
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          position: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ธนาคาร
                    </label>
                    <input
                      type="text"
                      value={formData.banking}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          banking: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 boder border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เลขบัญชี
                    </label>
                    <input
                      type="text"
                      value={formData.banking_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          banking_id: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      เงินเดือน
                    </label>
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          salary: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ค่าล่วงเวลา
                    </label>
                    <input
                      type="number"
                      value={formData.overtime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          overtime: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ขาด/สาย
                    </label>
                    <input
                      type="number"
                      value={formData.absent_late}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          absent_late: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ค่าใช้จ่าย
                    </label>
                    <input
                      type="number"
                      value={formData.expense}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expense: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ภาษี
                    </label>
                    <input
                      type="number"
                      value={formData.tax}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tax: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      กองทุนสำรอง
                    </label>
                    <input
                      type="number"
                      value={formData.providentfund}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          providentfund: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ประกันสังคม
                    </label>
                    <input
                      type="number"
                      value={formData.socialsecurity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialsecurity: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      งวดการจ่าย
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
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg w-full max-w-md">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    ยืนยันการลบข้อมูล
                  </h3>
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