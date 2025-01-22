import React from 'react';
import { Search, Download, Mail, CreditCard } from 'lucide-react';

const ExpenseSystem = () => {
  const employeeData = [
    { id: 'PR-000000036', status: 'จ่ายแล้ว', period: 'ประจำเดือน 12/62', payDate: '03/12/63', name: 'อี้ปโป้ ร้อยตพ', position: 'แม่บ้าน', salary: 8000.00, deduction: 0.00, tax: 400.00, netPay: 7600.00 },
    { id: 'PR-000000035', status: 'จ่ายแล้ว', period: 'ประจำเดือน 12/62', payDate: '03/12/63', name: 'ดวงดารดา เบญญ', position: 'ลูกน้อง', salary: 15000.00, deduction: 0.00, tax: 750.00, netPay: 14250.00 },
    { id: 'PR-000000034', status: 'จ่ายแล้ว', period: 'ประจำเดือน 12/62', payDate: '03/12/63', name: 'หัวหน้า ขยก', position: 'CEO', salary: 50000.00, deduction: 0.00, tax: 750.00, netPay: 49250.00 },
    { id: 'PR-000000033', status: 'รออนุมัติ', period: 'ประจำเดือน 11/62', payDate: '-', name: 'อี้ปโป้ ร้อยตพ', position: 'แม่บ้าน', salary: 8000.00, deduction: 0.00, tax: 400.00, netPay: 7600.00 },
    { id: 'PR-000000032', status: 'รออนุมัติ', period: 'ประจำเดือน 11/62', payDate: '-', name: 'ดวงดารดา เบญญ', position: 'ลูกน้อง', salary: 15000.00, deduction: 0.00, tax: 750.00, netPay: 14250.00 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-medium">ข้อมูลเงินเดือนและเบิกจ่าย | ประจำเดือน ธ.ค. 63</h1>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                เงินได้สุทธิ -<br/>
                ประจำเดือน ธ.ค. 63
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                เงินได้สุทธิ -<br/>
                ประจำปี 63
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div>
              <div className="text-gray-600 text-sm">พนักงาน</div>
              <div className="font-medium">3 คน</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">เงินเดือน</div>
              <div className="font-medium">-</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">ประกันสังคม</div>
              <div className="font-medium">-</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">ภาษี</div>
              <div className="font-medium">-</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">ยอดเบิกจ่าย</div>
              <div className="font-medium">-</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-6">
            <button className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">
              ตัวกรอง
            </button>
            <button className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">
              คอลัมน์...ดำเนินก
            </button>
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหา..."
                className="pl-10 w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border rounded-lg">
                <option>No. ▼</option>
              </select>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                จ่ายเงินเดือน
              </button>
              <select className="px-4 py-2 border rounded-lg">
                <option>ตลอดเวลา ▼</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-2 rounded-lg">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-2">
              <Download className="w-4 h-4" />
              พิมพ์เอกสาร
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              ส่ง Email
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              ธนาคาร
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              K Cash Connect
            </button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              SCB Anywhere
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-y">
                <tr>
                  <th className="px-4 py-2"><input type="checkbox" /></th>
                  <th className="px-4 py-2 text-left">No.</th>
                  <th className="px-4 py-2 text-left">สถานะ</th>
                  <th className="px-4 py-2 text-left">รอบจ่าย</th>
                  <th className="px-4 py-2 text-left">วันที่จ่าย</th>
                  <th className="px-4 py-2 text-left">ชื่อพนักงาน</th>
                  <th className="px-4 py-2 text-left">ตำแหน่ง</th>
                  <th className="px-4 py-2 text-right">เงินเดือน</th>
                  <th className="px-4 py-2 text-right">ยอดเบิกจ่าย</th>
                  <th className="px-4 py-2 text-right">ยอดรวมหัก</th>
                  <th className="px-4 py-2 text-right">เงินได้สุทธิ</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-blue-50">
                    <td className="px-4 py-2"><input type="checkbox" /></td>
                    <td className="px-4 py-2 text-blue-600">{employee.id}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${employee.status === 'จ่ายแล้ว' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        {employee.status}
                      </div>
                    </td>
                    <td className="px-4 py-2">{employee.period}</td>
                    <td className="px-4 py-2">{employee.payDate}</td>
                    <td className="px-4 py-2">{employee.name}</td>
                    <td className="px-4 py-2">{employee.position}</td>
                    <td className="px-4 py-2 text-right">{employee.salary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">{employee.deduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">{employee.tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2 text-right">{employee.netPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">1-20 of 36</div>
            <div className="flex gap-2 items-center">
              <button className="px-2 py-1 border rounded">◀</button>
              <button className="px-2 py-1 border rounded">▶</button>
              <div className="text-gray-600">แสดง</div>
              <button className="px-2 py-1 text-blue-600">20</button>
              <button className="px-2 py-1">50</button>
              <button className="px-2 py-1">100</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSystem;