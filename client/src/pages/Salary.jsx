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
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="p-2 text-left font-medium text-gray-500 sticky left-0 bg-gray-50">
                          ข้อมูลพนักงาน
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          สถานะ
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          ตำแหน่ง
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          วันที่จ่าย
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          ข้อมูลธนาคาร
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          เงินเดือน
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          ค่าล่วงเวลา
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          โบนัส
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          ขาด/สาย
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          ค่าเบิกเงิน
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          ภาษี
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          กองทุน
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          ประกันสังคม
                        </th>
                        <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                          รายได้สุทธิ
                        </th>
                        {user?.role === "admin" && (
                          <th className="p-4 text-center font-medium text-gray-500 whitespace-nowrap">
                            จัดการ
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="p-4 sticky left-0 bg-white">
                              <div className="font-medium">{`${item.firstname} ${item.lastname}`}</div>
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
                                  Start:{" "}
                                  {new Date(
                                    item.payroll_startdate
                                  ).toLocaleDateString("th-TH")}
                                </div>
                                <div>
                                  End:{" "}
                                  {new Date(
                                    item.payroll_enddate
                                  ).toLocaleDateString("th-TH")}
                                </div>
                                <div className="text-gray-500">
                                  Pay:{" "}
                                  {item.payment_date
                                    ? new Date(
                                        item.payment_date
                                      ).toLocaleDateString("th-TH")
                                    : "--/--/----"}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <div className="text-sm whitespace-nowrap">
                                <div>{item.banking}</div>
                                <div className="text-gray-500">
                                  {item.banking_id}
                                </div>
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
                            {user?.role === "admin" ? (
                              <td className="p-4 text-center whitespace-nowrap">
                                <div className="flex justify-center space-x-2">
                                  {/* <button
                                    onClick={() => PrintablePayslip(item)}
                                    className="p-1 text-gray-500 hover:text-gray-700"
                                    title="พิมพ์ใบแจ้งเงินเดือน"
                                  >
                                    <Printer size={20} />
                                  </button> */}
                                  <button
                                    onClick={() => openEditModal(item)}
                                    className="p-1 text-blue-500 hover:text-blue-700"
                                    title="แก้ไขข้อมูล"
                                  >
                                    <Edit2 size={20} />
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(item)}
                                    className="p-1 text-red-500 hover:text-red-700"
                                    title="ลบข้อมูล"
                                  >
                                    <Trash2 size={20} />
                                  </button>
                                </div>
                              </td>
                            ) : (
                              <td className="p-4 text-center whitespace-nowrap">
                                {/* <div className="flex justify-center">
                                  <button
                                    onClick={() => handlePrint(item)}
                                    className="p-1 text-gray-500 hover:text-gray-700"
                                    title="พิมพ์ใบแจ้งเงินเดือน"
                                  >
                                    <Printer size={20} />
                                  </button>
                                </div> */}
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="15"
                            className="text-center py-8 text-gray-500"
                          >
                            ไม่พบข้อมูลรหัสพนักงานที่ค้นหา
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-center items-center space-x-2 mt-4">
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
            </>
          )}
          {/* Add/Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg w-full max-w-3xl">
                <div className="flex justify-between items-center p-6 border-b">
                  <h3 className="text-xl font-semibold">
                    {isEditing
                      ? "แก้ไขข้อมูลเงินเดือน"
                      : "เพิ่มข้อมูลเงินเดือน"}
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

                <form
                  onSubmit={isEditing ? handleEdit : handleAdd}
                  className="p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* รหัสพนักงาน */}
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

                    {/* เลือกเดือน */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        เลือกเดือน
                      </label>
                      <input
                        type="month"
                        defaultValue={
                          formData.payroll_startdate
                            ? `${new Date(
                                formData.payroll_startdate
                              ).getFullYear()}-${(
                                new Date(
                                  formData.payroll_startdate
                                ).getMonth() + 1
                              )
                                .toString()
                                .padStart(2, "0")}`
                            : ""
                        }
                        onChange={(e) => {
                          const selectedMonth = e.target.value; // Format: YYYY-MM
                          const [year, month] = selectedMonth
                            .split("-")
                            .map(Number);
                          const startDate = `${selectedMonth}-01`;
                          const endDate = new Date(year, month, 0);

                          setFormData({
                            ...formData,
                            payroll_startdate: startDate,
                            payroll_enddate: `${year}-${String(month).padStart(
                              2,
                              "0"
                            )}-${endDate.getDate()}`,
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
