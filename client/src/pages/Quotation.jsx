import React, { useState, useEffect } from 'react';
import logo from "../img/japanlogo.png";

const Quotation = () => {
  const [quotationData, setQuotationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/quotation');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQuotationData(data.listQuotation[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuotation();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!quotationData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No quotation data available
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      {/* Header with improved styling */}
      <div className="flex justify-between items-center mb-8 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-blue-600">ใบเสนอราคา</h1>
          <h2 className="text-xl text-gray-600">Quotation</h2>
          <p className="text-sm text-gray-400 mt-1">(ต้นฉบับ / original)</p>
        </div>
        <div className="">
          <img src={logo} alt="Company Logo" className=" mt-5 w-[160px] h-[100px] object-cover" />
        </div>
      </div>

      {/* Customer Info with card-like styling */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="w-32 text-gray-600">ลูกค้า<br/>Customer:</span>
              <span className="font-medium">{quotationData.cus_name}</span>
            </div>
            <div className="flex items-start">
              <span className="w-32 text-gray-600">ที่อยู่<br/>Address:</span>
              <span className="font-medium">{quotationData.address}</span>
            </div>
            <div className="flex items-start">
              <span className="w-32 text-gray-600">เลขประจำตัว<br/>Tax ID:</span>
              <span className="font-medium">{quotationData.tax_id}</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="w-32 text-gray-600">เลขที่<br/>No:</span>
              <span className="font-medium">QT{String(quotationData.quotation_id).padStart(5, '0')}</span>
            </div>
            <div className="flex items-start">
              <span className="w-32 text-gray-600">วันที่<br/>Date:</span>
              <span className="font-medium">{formatDate(quotationData.date)}</span>
            </div>
            <div className="flex items-start">
              <span className="w-32 text-gray-600">ใช้ได้ถึง<br/>Valid:</span>
              <span className="font-medium">{formatDate(quotationData.date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table with improved styling */}
      <div className="overflow-hidden rounded-lg border border-gray-200 mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">รหัส<br/>ID no</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">คำอธิบาย<br/>Description</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">จำนวน<br/>Quantity</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">หน่วย<br/>Unit</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">ราคาต่อหน่วย<br/>Unit Price</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">จำนวนเงินรวม<br/>Pre-Tax Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="px-4 py-4">{quotationData.no_item}</td>
              <td className="px-4 py-4">{quotationData.description}</td>
              <td className="px-4 py-4 text-right">{quotationData.quantity}</td>
              <td className="px-4 py-4 text-right">Units</td>
              <td className="px-4 py-4 text-right">{quotationData.price.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-4 text-right">{quotationData.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals with enhanced styling */}
      <div className="flex justify-between mb-8">
        <div className="w-1/2 bg-gray-50 p-4 rounded-lg">
          <p className="font-bold mb-3 text-gray-700">หมายเหตุ / Remarks</p>
          <p className="text-sm">Project: {quotationData.project_name}</p>
        </div>
        <div className="w-5/12">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">ราคาสุทธิก่อนส่วนลด<br/>Subtotal</span>
              <span className="font-medium">{quotationData.subtotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">ส่วนลดพิเศษ<br/>Special Discount</span>
              <span className="font-medium text-red-600">-{quotationData.special_discount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">ราคาหลังหักส่วนลด<br/>After Discount</span>
              <span className="font-medium">{quotationData.after_discount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">ภาษีมูลค่าเพิ่ม 7%<br/>VAT 7%</span>
              <span className="font-medium">{quotationData.vat.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between py-3 bg-blue-50 rounded-lg px-3 mt-2">
              <span className="font-bold text-blue-800">จำนวนเงินรวมทั้งสิ้น (บาท)<br/>Grand Total</span>
              <span className="font-bold text-blue-800">{quotationData.total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with signature sections */}
      <div className="grid grid-cols-3 gap-8 mt-16">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="font-bold mb-3 text-gray-700">การชำระเงิน / Payment</p>
          <p className="text-gray-600">Credit Term: {quotationData.credit_term} days</p>
        </div>
        <div className="text-center p-4">
          <p className="font-bold mb-10 text-gray-700">อนุมัติโดย / Approved by</p>
          <p className=" text-gray-600">{quotationData.sale_name}</p>
          <div className="mt-1 border-t border-gray-400 pt-2">
            <p className="text-sm text-gray-500">วันที่ / Date</p>
          </div>
        </div>
        <div className="text-center p-4">
          <p className="font-bold mb-3 text-gray-700">ยอมรับใบเสนอราคา / Accepted by</p>
          <div className="mt-11 border-t border-gray-400 pt-2">
            <p className="text-sm text-gray-500">วันที่ / Date</p>
          </div>
        </div>
      </div>

      {/* Page number and prepared by */}
      <div className="text-center mt-12 text-gray-500">
        <p className="mb-1">หน้า 1/1</p>
        <p className="text-sm">จัดทำโดย / Prepared by: {quotationData.contract_name}</p>
      </div>
    </div>
  );
};

export default Quotation;