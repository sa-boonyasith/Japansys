import React, { useEffect, useState } from 'react';

const Test = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [error, setError] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const months = [
    { value: '01', label: 'มกราคม' },
    { value: '02', label: 'กุมภาพันธ์' },
    { value: '03', label: 'มีนาคม' },
    { value: '04', label: 'เมษายน' },
    { value: '05', label: 'พฤษภาคม' },
    { value: '06', label: 'มิถุนายน' },
    { value: '07', label: 'กรกฎาคม' },
    { value: '08', label: 'สิงหาคม' },
    { value: '09', label: 'กันยายน' },
    { value: '10', label: 'ตุลาคม' },
    { value: '11', label: 'พฤศจิกายน' },
    { value: '12', label: 'ธันวาคม' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/salary');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSalaryData(data.listSalary);
        setFilteredItems(data.listSalary);
      } catch (err) {
        setError('Failed to fetch salary data.');
        console.error(err);
      }
    };

    fetchSalaryData();
  }, []);

  useEffect(() => {
    let filtered = [...salaryData];

    if (employeeId) {
      filtered = filtered.filter(item => 
        item.employee_id.toString().includes(employeeId.trim())
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(item => {
        const payrollMonth = new Date(item.payroll_startdate).getMonth() + 1;
        return payrollMonth.toString().padStart(2, '0') === selectedMonth;
      });
    }

    if (selectedYear) {
      filtered = filtered.filter(item => {
        const payrollYear = new Date(item.payroll_startdate).getFullYear();
        return payrollYear === selectedYear;
      });
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [employeeId, selectedMonth, selectedYear, salaryData]);

  // Keep all existing helper functions
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  const getStatusDisplay = (status) => {
    if (status === 'Paid') {
      return (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-green-700">จ่ายแล้ว</span>
        </div>
      );
    } else if (status === 'Pending') {
      return (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-yellow-700">รออนุมัติ</span>
        </div>
      );
    }
    return null;
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
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
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
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
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          ถัดไป
        </button>
      </div>
    );
  };

  return (
    <div className=" max-w-full  ">
      <div className="bg-white rounded-lg shadow-lg">
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
                  type="text"
                  placeholder="ใส่รหัสพนักงาน..."
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {employeeId && (
                  <button
                    onClick={() => setEmployeeId('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {salaryData.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-gray-500">Loading data...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200  bg-gray-50">
                      <th className="p-2 text-center font-medium text-gray-500">ข้อมูลพนักงาน</th>
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
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={index} className="border-b text-center border-gray-100 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="font-medium">{`${item.firstname} ${item.lastname}`}</div>
                            <div className="text-sm text-gray-500">ID: {item.employee_id}</div>
                          </td>
                          <td className="p-4">{getStatusDisplay(item.status)}</td>
                          <td className="p-4">{item.position}</td>
                          <td className="p-4">
                            <div className="text-sm">
                              <div>Start: {new Date(item.payroll_startdate).toLocaleDateString('th-TH')}</div>
                              <div>End: {new Date(item.payroll_enddate).toLocaleDateString('th-TH')}</div>
                              <div className="text-gray-500">Pay date: {new Date(item.payment_date).toLocaleDateString('th-TH')}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <div>{item.banking}</div>
                              <div className="text-gray-500">{item.banking_id}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-green-500"> + {formatCurrency(item.salary)}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-medium">
                              <div className="font-medium text-green-500"> + {formatCurrency(item.overtime)}</div>
                            </div>
                          </td>
                          <td>
                          <div className='text-sm font-medium'>
                            <div className='font-medium text-green-500'> + {formatCurrency(item.bonus)}</div>
                          </div>
                          </td>
                          <td>
                          <div className='text-sm font-medium'>
                            <div className='font-medium text-red-500'> - {formatCurrency(item.absent_late)}</div>
                          </div>
                          </td>
                          <td>
                          <div className='text-sm font-medium'>
                            <div className='font-medium text-red-500'> - {formatCurrency(item.expense)}</div>
                          </div>
                          </td>
                          <td className="p-2">
                            <div className="text-sm font-medium">
                              <div className='text-red-500'> - {formatCurrency(item.tax)}</div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="text-sm font-medium">
                              <div className='text-red-500'> - {formatCurrency(item.providentfund)}</div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="text-sm font-medium">
                              <div className='text-red-500'> - {formatCurrency(item.socialsecurity)}</div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="text-lg font-bold text-green-500">
                              {formatCurrency(item.salary_total)}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-8 text-gray-500">
                          ไม่พบข้อมูลรหัสพนักงานที่ค้นหา
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;