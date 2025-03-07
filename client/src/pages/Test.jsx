import React, { useEffect, useState } from "react";
import { PlusCircle, Edit2, Trash2, X, Printer } from "lucide-react";

const PrintablePayslip = ({ item }) => {
  return (
    <div className="p-8 bg-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">ใบแจ้งเงินเดือน</h1>
        <p className="text-gray-600">
          งวดวันที่{" "}
          {new Date(item.payroll_startdate).toLocaleDateString("th-TH")} ถึง{" "}
          {new Date(item.payroll_enddate).toLocaleDateString("th-TH")}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">ข้อมูลพนักงาน</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>ชื่อ-นามสกุล:</strong> {item.firstname} {item.lastname}
            </p>
            <p>
              <strong>รหัสพนักงาน:</strong> {item.employee_id}
            </p>
          </div>
          <div>
            <p>
              <strong>ตำแหน่ง:</strong> {item.position}
            </p>
            <p>
              <strong>สถานะ:</strong>{" "}
              {item.status === "Paid" ? "จ่ายแล้ว" : "รออนุมัติ"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">รายละเอียดการจ่ายเงิน</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2 text-green-600">รายได้</h3>
            <p>
              เงินเดือน:{" "}
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(item.salary)}
            </p>
            <p>
              ค่าล่วงเวลา:{" "}
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(item.overtime)}
            </p>
            <p>
              โบนัส:{" "}
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(item.bonus)}
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-red-600">รายการหัก</h3>
            <p>
              ขาด/สาย:{" "}
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(item.absent_late)}
            </p>
            <p>
              ค่าเบิกเงิน:{" "}
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(item.expense)}
            </p>
            <p>
              ภาษี:{" "}
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(item.tax)}
            </p>
            <p>
              กองทุน:{" "}
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(item.providentfund)}
            </p>
            <p>
              ประกันสังคม:{" "}
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(item.socialsecurity)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="text-right">
          <h3 className="text-xl font-bold">
            รายได้สุทธิ:{" "}
            {new Intl.NumberFormat("th-TH", {
              style: "currency",
              currency: "THB",
            }).format(item.salary_total)}
          </h3>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>โอนเข้าบัญชี: {item.banking}</p>
        <p>เลขที่บัญชี: {item.banking_id}</p>
        <p>
          วันที่จ่าย:{" "}
          {item.payment_date
            ? new Date(item.payment_date).toLocaleDateString("th-TH")
            : "รอดำเนินการ"}
        </p>
      </div>
    </div>
  );
};

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
  const [employees, setEmployees] = useState([]); // New state for employees

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // แปลง JSON เป็น Object
    }
  }, []);
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

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/employees"); // Replace with your actual endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data); // Assuming the API returns an array of employees
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees.");
    }
  };

  useEffect(() => {
    fetchSalaryData();
  }, []);

  useEffect(() => {
    fetchEmployees();
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

    if (!selectedItem || !selectedItem.salary_id) {
      console.error("Error: selectedItem หรือ selectedItem.id เป็น undefined");
      setError("เกิดข้อผิดพลาด: ไม่พบ ID ของเงินเดือนที่ต้องแก้ไข");
      return;
    }

    console.log("Updating salary with ID:", selectedItem.salary_id);

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

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // When editing, set the month input value based on payroll_startdate
    if (isEditing && formData.payroll_startdate) {
      const date = new Date(formData.payroll_startdate);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const monthInputValue = `${year}-${month}`;

      // Update the month input value
      const monthInput = document.querySelector('input[type="month"]');
      if (monthInput) {
        monthInput.value = monthInputValue;
      }
    }
  }, [isEditing, formData.payroll_startdate]);

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

  const handleEmployeeChange = (e) => {
    const selectedEmployeeId = e.target.value;
    setFormData({ ...formData, employee_id: selectedEmployeeId });
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg ">
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

              {/* Employee Select Dropdown */}
              <select
                value={formData.employee_id}
                onChange={handleEmployeeChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.employee_id} value={employee.employee_id}>
                    {employee.firstname} {employee.lastname} ({employee.employee_id})
                  </option>
                ))}
              </select>

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
          {salaryData.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <svg
                className="animate-spin h-8 w-8 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="ml-2 text-gray-500">Loading data...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="p-3 text-left font-semibold">งวด</th>
                        <th className="p-3 text-left font-semibold">รหัสพนักงาน</th>
                        <th className="p-3 text-left font-semibold">ชื่อ</th>
                        <th className="p-3 text-left font-semibold">ตำแหน่ง</th>
                        <th className="p-3 text-left font-semibold">เงินเดือน</th>
                        <th className="p-3 text-left font-semibold">สถานะ</th>
                        <th className="p-3 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr key={item.salary_id} className="hover:bg-gray-50">
                          <td className="p-3">
                            {new Date(item.payroll_startdate).toLocaleDateString("th-TH")} -{" "}
                            {new Date(item.payroll_enddate).toLocaleDateString("th-TH")}
                          </td>
                          <td className="p-3">{item.employee_id}</td>
                          <td className="p-3">
                            {item.firstname} {item.lastname}
                          </td>
                          <td className="p-3">{item.position}</td>
                          <td className="p-3">{formatCurrency(item.salary_total)}</td>
                          <td className="p-3">{getStatusDisplay(item.status)}</td>
                          <td className="p-3 flex justify-center gap-2">
                            {user?.role === "admin" && (
                              <>
                                <button
                                  onClick={() => openEditModal(item)}
                                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => openDeleteModal(item)}
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                            <PrintablePayslip item={item} />
                            <button
                              onClick={() => window.print()}
                              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
                            >
                              <Printer size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {filteredItems.length > itemsPerPage && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === pageNumber
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? "แก้ไขข้อมูลเงินเดือน" : "เพิ่มข้อมูลเงินเดือน"}
            </h2>
            <form onSubmit={isEditing ? handleEdit : handleAdd} className="flex flex-col gap-4">
              {/* Employee Select Dropdown in Modal */}
              <label htmlFor="employee_id" className="block text-gray-700 text-sm font-bold">
                Employee:
              </label>
              <select
                id="employee_id"
                value={formData.employee_id}
                onChange={handleEmployeeChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.employee_id} value={employee.employee_id}>
                    {employee.firstname} {employee.lastname} ({employee.employee_id})
                  </option>
                ))}
              </select>

              <label htmlFor="firstname">First Name:</label>
              <input
                type="text"
                id="firstname"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter first name"
              />

              <label htmlFor="lastname">Last Name:</label>
              <input
                type="text"
                id="lastname"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter last name"
              />

              <label htmlFor="position">Position:</label>
              <input
                type="text"
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter position"
              />

              <label htmlFor="banking">Banking:</label>
              <input
                type="text"
                id="banking"
                value={formData.banking}
                onChange={(e) => setFormData({ ...formData, banking: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter banking"
              />

              <label htmlFor="banking_id">Banking ID:</label>
              <input
                type="text"
                id="banking_id"
                value={formData.banking_id}
                onChange={(e) => setFormData({ ...formData, banking_id: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter banking ID"
              />

              <label htmlFor="salary">Salary:</label>
              <input
                type="number"
                id="salary"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter salary"
              />

              <label htmlFor="overtime">Overtime:</label>
              <input
                type="number"
                id="overtime"
                value={formData.overtime}
                onChange={(e) => setFormData({ ...formData, overtime: Number(e.target.value) })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter overtime"
              />

              <label htmlFor="bonus">Bonus:</label>
              <input
                type="number"
                id="bonus"
                value={formData.bonus}
                onChange={(e) => setFormData({ ...formData, bonus: Number(e.target.value) })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter bonus"
              />

              <label htmlFor="absent_late">Absent/Late:</label>
              <input
                type="number"
                id="absent_late"
                value={formData.absent_late}
                onChange={(e) => setFormData({ ...formData, absent_late: Number(e.target.value) })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter absent/late"
              />

              <label htmlFor="expense">Expense:</label>
              <input
                type="number"
                id="expense"
                value={formData.expense}
                onChange={(e) => setFormData({ ...formData, expense: Number(e.target.value) })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter expense"
              />

              <label htmlFor="tax">Tax:</label>
              <input
                type="number"
                id="tax"
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: Number(e.target.value) })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter tax"
              />

              <label htmlFor="providentfund">Provident Fund:</label>
              <input
                type="number"
                id="providentfund"
                value={formData.providentfund}
                onChange={(e) =>
                  setFormData({ ...formData, providentfund: Number(e.target.value) })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter provident fund"
              />

              <label htmlFor="socialsecurity">Social Security:</label>
              <input
                type="number"
                id="socialsecurity"
                value={formData.socialsecurity}
                onChange={(e) =>
                  setFormData({ ...formData, socialsecurity: Number(e.target.value) })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter social security"
              />

              <label htmlFor="payroll_startdate">Payroll Start Date:</label>
              <input
                type="date"
                id="payroll_startdate"
                value={formData.payroll_startdate}
                onChange={(e) =>
                  setFormData({ ...formData, payroll_startdate: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <label htmlFor="payroll_enddate">Payroll End Date:</label>
              <input
                type="date"
                id="payroll_enddate"
                value={formData.payroll_enddate}
                onChange={(e) =>
                  setFormData({ ...formData, payroll_enddate: e.target.value })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <label htmlFor="payment_date">Payment Date:</label>
              <input
                type="date"
                id="payment_date"
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">ยืนยันการลบ</h2>
            <p>คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลเงินเดือนนี้?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salary;
