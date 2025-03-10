import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    monthYear: format(new Date(), 'yyyy-MM')
  });

  const generateDescription = (monthYearValue) => {
    const [year, month] = monthYearValue.split('-');
    const selectedDate = new Date(year, month - 1, 1);
    const monthName = format(selectedDate, 'MMMM yyyy', { locale: th });
    return `การจ่ายเงินเดือนประจำเดือน${monthName}`;
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/payment');
      setPayments(response.data.listPayment);
      setError(null);
    } catch (err) {
      setError('Failed to load payment data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      monthYear: format(new Date(), 'yyyy-MM')
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const openModal = (payment = null) => {
    if (payment) {
      // For editing
      setIsEditing(true);
      setCurrentId(payment.payment_id);
      const paymentDate = new Date(payment.date);
      setFormData({
        monthYear: format(paymentDate, 'yyyy-MM')
      });
    } else {
      // For creating
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Generate description based on selected month/year
    const desc = generateDescription(formData.monthYear);
    
    // Create a date object for the first day of the selected month
    const [year, month] = formData.monthYear.split('-');
    const apiDate = new Date(year, month - 1, 1).toISOString();
    
    // Prepare data for API
    const apiData = {
      desc: desc,
      date: apiDate
    };
    
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/payment/${currentId}`, apiData);
      } else {
        await axios.post('http://localhost:8080/api/payment', apiData);
      }
      
      closeModal();
      fetchPayments();
    } catch (err) {
      setError(isEditing ? 'Failed to update payment.' : 'Failed to create payment.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      try {
        await axios.delete(`http://localhost:8080/api/payment/${id}`);
        fetchPayments();
      } catch (err) {
        setError('Failed to delete payment.');
        console.error(err);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1); // แก้ไขการเลื่อนเดือน
    return format(date, 'MMMM yyyy', { locale: th });
  };
  

  if (loading && payments.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">รายการจ่ายเงินเดือน</h1>
        <button 
          onClick={() => openModal()} 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          + สร้างรายการจ่ายเงินใหม่
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">ลำดับ</th>
              <th className="py-3 px-4 text-left">คำอธิบาย</th>
              <th className="py-3 px-4 text-left">เดือน</th>
              <th className="py-3 px-4 text-left">จำนวนเงิน</th>
              <th className="py-3 px-4 text-left">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <tr key={payment.payment_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{payment.desc}</td>
                  <td className="py-3 px-4">{formatDate(payment.date)}</td>
                  <td className="py-3 px-4">{formatCurrency(payment.total)}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button 
                      onClick={() => openModal(payment)} 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      แก้ไข
                    </button>
                    <button 
                      onClick={() => handleDelete(payment.payment_id)} 
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center">ไม่พบข้อมูลการจ่ายเงิน</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'แก้ไขรายการจ่ายเงิน' : 'สร้างรายการจ่ายเงินใหม่'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">เดือน</label>
                <input 
                  type="month" 
                  name="monthYear" 
                  value={formData.monthYear} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border rounded"
                  required
                />
                <p className="text-gray-500 text-sm mt-1">
                  * ระบบจะคำนวณการจ่ายเงินจากรายการเงินเดือนที่มีสถานะ "Paid" ในเดือนนี้
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700">
                  คำอธิบาย: <span className="font-medium">{generateDescription(formData.monthYear)}</span>
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  {isEditing ? 'บันทึกการแก้ไข' : 'สร้างรายการจ่ายเงิน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;