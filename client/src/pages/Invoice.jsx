import React from "react";
import logo from "../img/japanlogo.png";

const Invoice = () => {
  const [invoices, setInvoices] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);

  React.useEffect(() => {
    fetch("http://localhost:8080/api/invoice")
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data);
        
        // สร้างข้อมูลลูกค้าที่ไม่ซ้ำกันจากข้อมูลใบเสร็จ
        const uniqueCustomers = [];
        const customerMap = {};
        
        data.forEach(invoice => {
          if (invoice.customer) {
            const customerId = invoice.customer.cus_id;
            
            if (!customerMap[customerId]) {
              customerMap[customerId] = {
                ...invoice.customer,
                invoiceCount: 1,
                totalAmount: invoice.total
              };
            } else {
              customerMap[customerId].invoiceCount += 1;
              customerMap[customerId].totalAmount += invoice.total;
            }
          }
        });
        
        // แปลงเป็น array สำหรับแสดงผล
        Object.values(customerMap).forEach(customer => {
          uniqueCustomers.push(customer);
        });
        
        setCustomers(uniqueCustomers);
      })
      .catch((err) => console.error("Error fetching invoices:", err));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const thaiYear = date.getFullYear() + 543;
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${thaiYear}`;
  };

  const formatNumber = (num) => {
    return num?.toLocaleString("th-TH", { minimumFractionDigits: 2 }) || "0.00";
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    
    // หาใบเสร็จของลูกค้ารายนี้
    const customerInvoices = invoices.filter(
      invoice => invoice.customer?.cus_id === customer.cus_id
    );
    
    if (customerInvoices.length === 1) {
      // ถ้ามีใบเสร็จแค่ใบเดียว เปิด modal แสดงใบเสร็จเลย
      setSelectedInvoice(customerInvoices[0]);
      setIsModalOpen(true);
    } else {
      // ถ้ามีหลายใบเสร็จ เปิด modal ให้เลือกใบเสร็จก่อน
      setIsCustomerModalOpen(true);
    }
  };

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
    setIsCustomerModalOpen(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
  };

  // ปิด modal เมื่อคลิกพื้นที่ด้านนอก
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  const handleCustomerOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeCustomerModal();
    }
  };

  return (
    <div className="w-full">
      {/* Customer List */}
      <div className="mb-8 p-4">
        <h2 className="text-xl font-bold mb-4">รายการลูกค้าทั้งหมด</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <div
              key={customer.cus_id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleCustomerClick(customer)}
            >
              <p className="font-bold text-lg">{customer.cus_company_name}</p>
              <p>รหัสลูกค้า: {customer.cus_id}</p>
              <p>จำนวนใบแจ้งหนี้: {customer.invoiceCount} ใบ</p>
              <p>ยอดรวมทั้งสิ้น: {formatNumber(customer.totalAmount)} บาท</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Invoice Selection Modal */}
      {isCustomerModalOpen && selectedCustomer && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay"
          onClick={handleCustomerOutsideClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto p-6">
            {/* Modal Header with close button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">รายการใบแจ้งหนี้ของ {selectedCustomer.cus_company_name}</h2>
              <button 
                onClick={closeCustomerModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Invoice List for this customer */}
            <div className="divide-y">
              {invoices
                .filter(invoice => invoice.customer?.cus_id === selectedCustomer.cus_id)
                .map((invoice) => (
                  <div 
                    key={invoice.invoice_id}
                    className="py-4 hover:bg-gray-50 cursor-pointer transition-colors px-3 rounded-lg"
                    onClick={() => handleInvoiceSelect(invoice)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">เลขใบแจ้งหนี้: {invoice.invoice_id}</p>
                        <p>วันที่: {formatDate(invoice.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatNumber(invoice.total)} บาท</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {isModalOpen && selectedInvoice && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay"
          onClick={handleOutsideClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto p-6">
            {/* Modal Header with close button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">รายละเอียดใบแจ้งหนี้</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Invoice Content */}
            <div className="bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold">ใบแจ้งหนี้ / ใบกำกับภาษี</h1>
                  <h2 className="text-lg">Invoice / Tax Invoice</h2>
                  <div className="mt-4">
                    <p>ผู้ออก {selectedInvoice.customer?.cus_company_name}</p>
                    <p>{selectedInvoice.customer?.cus_address}</p>
                    <p>
                      เลขประจำตัวผู้เสียภาษี {selectedInvoice.customer?.cus_tax_id}{" "}
                      โทร {selectedInvoice.customer?.cus_phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src={logo}
                    alt="Company Logo"
                    className="mt-5 w-[160px] h-[100px] object-cover"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 border border-gray-300">
                <div className="p-4">
                  <p className="font-bold">
                    ลูกค้า {selectedInvoice.customer?.cus_company_name}
                  </p>
                  <p>ที่อยู่ {selectedInvoice.customer?.cus_address}</p>
                  <p>
                    เลขประจำตัวผู้เสียภาษี {selectedInvoice.customer?.cus_tax_id}
                  </p>
                  <p>โทร {selectedInvoice.customer?.cus_phone}</p>
                </div>
                <div className="p-4 border-l border-gray-300">
                  <p>เลขใบแจ้งหนี้: {selectedInvoice.invoice_id}</p>
                  <p>วันที่ {formatDate(selectedInvoice.date)}</p>
                  <p>เครดิต 30 วัน</p>
                </div>
              </div>

              <table className="w-full mt-8 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray text-left p-2">ลำดับ</th>
                    <th className="border border-gray-300 p-2 text-left">รายงาน</th>
                    <th className="border border-gray-300 p-2 text-right">จำนวน</th>
                    <th className="border border-gray-300 p-2 text-right">ราคา</th>
                    <th className="border border-gray-300 p-2 text-right">
                      ส่วนลด
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      ราคารวม
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item, index) => (
                    <tr key={item.item_id}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">
                        {item.product.name}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatNumber(item.product.price)}{" "}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatNumber(item.discount)}{" "}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {formatNumber(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 p-2 text-right"
                    >
                      รวมเป็นเงิน
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatNumber(selectedInvoice.subtotal)}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 p-2 text-right"
                    >
                      ภาษีมูลค่าเพิ่ม {selectedInvoice.vat_rate}%
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatNumber(selectedInvoice.vat)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 p-2 text-right font-bold"
                    >
                      จำนวนเงินทั้งสิ้น
                    </td>
                    <td className="border border-gray-300 p-2 text-right font-bold">
                      {formatNumber(selectedInvoice.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="grid grid-cols-2 gap-8 mt-[60px] text-center">
                <div>
                  <div className="border-b border-gray-400 mb-2 h-8"></div>
                  <p>ผู้รับใบเสร็จ</p>
                </div>
                <div>
                  <div className="border-b border-gray-400 mb-2 h-8"></div>
                  <p>ผู้ออกใบเสร็จ</p>
                </div>
              </div>

              {/* Print button */}
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => window.print()} 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  พิมพ์ใบแจ้งหนี้
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;