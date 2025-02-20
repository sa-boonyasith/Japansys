import React from 'react';

const PrintablePayslip = ({ item }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8">
      {/* Header Section */}
      <div className="text-center mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold mb-2">ใบแจ้งเงินเดือน</h1>
        <p className="text-gray-600">
          งวดวันที่ {new Date(item.payroll_startdate).toLocaleDateString("th-TH")} ถึง{" "}
          {new Date(item.payroll_enddate).toLocaleDateString("th-TH")}
        </p>
      </div>

      {/* Employee Information */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">ข้อมูลพนักงาน</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">ชื่อ-นามสกุล:</span>
              <span className="ml-2">{item.firstname} {item.lastname}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">รหัสพนักงาน:</span>
              <span className="ml-2">{item.employee_id}</span>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">ตำแหน่ง:</span>
              <span className="ml-2">{item.position}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">สถานะ:</span>
              <span className="ml-2">{item.status === "Paid" ? "จ่ายแล้ว" : "รออนุมัติ"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Details */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">รายละเอียดการจ่ายเงิน</h2>
        <div className="grid grid-cols-2 gap-8">
          {/* Income Section */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-bold mb-4 text-green-700 border-b pb-2">รายได้</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>เงินเดือน</span>
                <span className="text-green-600">{formatCurrency(item.salary)}</span>
              </div>
              <div className="flex justify-between">
                <span>ค่าล่วงเวลา</span>
                <span className="text-green-600">{formatCurrency(item.overtime)}</span>
              </div>
              <div className="flex justify-between">
                <span>โบนัส</span>
                <span className="text-green-600">{formatCurrency(item.bonus)}</span>
              </div>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="font-bold mb-4 text-red-700 border-b pb-2">รายการหัก</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>ขาด/สาย</span>
                <span className="text-red-600">{formatCurrency(item.absent_late)}</span>
              </div>
              <div className="flex justify-between">
                <span>ค่าเบิกเงิน</span>
                <span className="text-red-600">{formatCurrency(item.expense)}</span>
              </div>
              <div className="flex justify-between">
                <span>ภาษี</span>
                <span className="text-red-600">{formatCurrency(item.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>กองทุน</span>
                <span className="text-red-600">{formatCurrency(item.providentfund)}</span>
              </div>
              <div className="flex justify-between">
                <span>ประกันสังคม</span>
                <span className="text-red-600">{formatCurrency(item.socialsecurity)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Net Salary */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-800">รายได้สุทธิ</span>
          <span className="text-2xl font-bold text-blue-800">
            {formatCurrency(item.salary_total)}
          </span>
        </div>
      </div>

      {/* Payment Information */}
      <div className="text-sm text-gray-600 border-t pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1"><span className="font-semibold">โอนเข้าบัญชี:</span> {item.banking}</p>
            <p><span className="font-semibold">เลขที่บัญชี:</span> {item.banking_id}</p>
          </div>
          <div className="text-right">
            <p className="mb-1">
              <span className="font-semibold">วันที่จ่าย:</span>{" "}
              {item.payment_date
                ? new Date(item.payment_date).toLocaleDateString("th-TH")
                : "รอดำเนินการ"}
            </p>
            <p className="text-xs text-gray-500">เอกสารฉบับนี้ออกโดยระบบคอมพิวเตอร์</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintablePayslip;