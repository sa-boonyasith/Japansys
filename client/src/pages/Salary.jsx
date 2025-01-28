import React, { useEffect, useState } from 'react';

const Test = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/salary');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSalaryData(data.listSalary);
      } catch (err) {
        setError('Failed to fetch salary data.');
        console.error(err);
      }
    };

    fetchSalaryData();
  }, []);

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

  return (
    <div className="p-8 max-w-[95%] mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Salary Data</h2>
        </div>
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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="p-4 text-left font-medium text-gray-500">Employee Info</th>
                    <th className="p-4 text-left font-medium text-gray-500">สถานะ</th>
                    <th className="p-4 text-left font-medium text-gray-500">Position</th>
                    <th className="p-4 text-left font-medium text-gray-500">Payment Period</th>
                    <th className="p-4 text-left font-medium text-gray-500">Banking Details</th>
                    <th className="p-4 text-left font-medium text-gray-500">Base Salary</th>
                    <th className="p-4 text-left font-medium text-gray-500">Adjustments</th>
                    <th className="p-4 text-left font-medium text-gray-500">Deductions</th>
                    <th className="p-4 text-left font-medium text-gray-500">Final Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {salaryData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
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
                        <div className="font-medium">{formatCurrency(item.salary)}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="text-red-500">ขาด/สาย: -{formatCurrency(item.absent_late)}</div>
                          <div className="text-green-500">ค่าล่วงเวลา: +{formatCurrency(item.overtime)}</div>
                          <div className="text-green-500">โบนัส: +{formatCurrency(item.bonus)}</div>
                          <div>ค่าเบิกเงิน: {formatCurrency(item.expense)}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>ภาษี: {formatCurrency(item.tax)}</div>
                          <div>กองทุน: {formatCurrency(item.providentfund)}</div>
                          <div>ประกันสังคม: {formatCurrency(item.socialsecurity)}</div>
                          <div className="font-medium">Total: {formatCurrency(item.tax_total)}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-lg font-bold">
                          {formatCurrency(item.salary_total)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;