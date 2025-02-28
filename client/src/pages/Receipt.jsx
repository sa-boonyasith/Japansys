import React from "react";
import logo from "../img/japanlogo.png";

const Receipt = () => {
  const [receipts, setReceipt] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [products, setProducts] = React.useState([]); // เพิ่ม state สำหรับข้อมูลสินค้า
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [selectedReceipt, setSelectedReceipt] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // เพิ่ม state สำหรับ pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const receiptsPerPage = 5;

  // ดึงข้อมูลลูกค้า, สินค้า และใบเสนอราคา
  React.useEffect(() => {
    // ดึงข้อมูลลูกค้าก่อน
    fetch("http://localhost:8080/api/customer")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch customers");
        return res.json();
      })
      .then((data) => {
        const customerlist = data.listCustomer || [];
        setCustomers(customerlist);

        // ดึงข้อมูลสินค้า
        return fetch("http://localhost:8080/api/product");
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        // รับข้อมูลสินค้าจากโครงสร้าง API
        const productsList = data || [];
        setProducts(productsList);

        // จากนั้นดึงข้อมูลใบเสนอราคา
        return fetch("http://localhost:8080/api/receipt");
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch receipts");
        return res.json();
      })
      .then((data) => {
        // รับข้อมูลใบเสนอราคาจากโครงสร้าง API
        const receiptsList = data.listReceipt || [];
        setReceipt(receiptsList);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setIsLoading(false);
      });
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
    return parseFloat(num || 0).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2, // กำหนดให้แสดงทศนิยมไม่เกิน 2 ตำแหน่ง
    });
  };
  

  // หาข้อมูลลูกค้าจาก customer_id
  const findCustomerById = (customerId) => {
    return (
      customers.find((customer) => customer.customer_id === customerId) || {}
    );
  };

  const findProductById = (productId) => {
    const product = products.find((product) => product.product_id === Number(productId));
    return product || {};
  };
  
  
// สร้างฟังก์ชันสำหรับดึงชื่อสินค้า
const getProductName = (item) => {
  // ถ้ามี product_id ให้ดึงชื่อจากตาราง products
  if (item.product_id) {
    const product = findProductById(item.product_id);
    return product.name || "ไม่พบข้อมูลสินค้า";
  }
  // ถ้าไม่มี product_id แต่มี name ให้ใช้ name ที่มีอยู่
  return item.name || "ไม่ระบุชื่อสินค้า";
};

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setCurrentPage(1); // รีเซ็ตหน้าเมื่อเลือกลูกค้าใหม่

    // หาใบเสนอราคาของลูกค้ารายนี้
    const customerReceipts = receipts.filter(
      (receipt) => receipt.customer_id === customer.customer_id
    );

    if (customerReceipts.length === 1) {
      
      setSelectedQuotation(customerReceipts[0]);
      setIsModalOpen(true);
    } else if (customerReceipts.length > 1) {
      // ถ้ามีหลายใบเสนอราคา เปิด modal ให้เลือกใบเสนอราคาก่อน
      setIsCustomerModalOpen(true);
    } else {
      // ไม่มีใบเสนอราคา
      alert("ไม่พบใบเสนอราคาสำหรับลูกค้ารายนี้");
    }
  };

  const handleReceiptSelect = (receipt) => {
    setSelectedReceipt(receipt);
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

  // จัดกลุ่มใบเสนอราคาตามลูกค้า
  const getCustomersWithReceipts = () => {
    const customerMap = {};

    receipts.forEach((receipt) => {
      const customerId = receipt.customer_id;

      if (!customerMap[customerId]) {
        const customerData = findCustomerById(customerId);
        customerMap[customerId] = {
          ...customerData,
          receiptCount: 1,
          totalAmount: parseFloat(receipt.total_all || 0),
        };
      } else {
        customerMap[customerId].receiptCount += 1;
        customerMap[customerId].totalAmount += parseFloat(
          receipt.total_all || 0
        );
      }
    });

    return Object.values(customerMap);
  };

  // คำนวณข้อมูลสำหรับ pagination
  const getPaginatedReceipts = () => {
    if (!selectedCustomer) return [];

    // กรองใบเสนอราคาของลูกค้าที่เลือก
    const customerReceipts = receipts.filter(
      (receipt) => receipt.customer_id === selectedCustomer.customer_id
    );

    // คำนวณ offset
    const indexOfLastReceipt = currentPage * receiptsPerPage;
    const indexOfFirstReceipt = indexOfLastReceipt - receiptsPerPage;

    // ส่งคืนเฉพาะรายการในหน้าปัจจุบัน
    return customerReceipts.slice(
      indexOfFirstReceipt,
      indexOfLastReceipt
    );
  };

  // เปลี่ยนหน้า
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // คำนวณจำนวนหน้าทั้งหมด
  const getPageCount = () => {
    if (!selectedCustomer) return 0;

    const customerReceipts = receipts.filter(
      (receipt) => receipt.customer_id === selectedCustomer.customer_id
    );

    return Math.ceil(customerReceipts.length / receiptsPerPage);
  };

  const customersWithReceipts = getCustomersWithReceipts();
  const paginatedReceipts = getPaginatedReceipts();
  const totalPages = getPageCount();

  if (isLoading) {
    return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        เกิดข้อผิดพลาด: {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Customer List */}
      <div className="mb-8 p-4">
        <h2 className="text-xl font-bold mb-4">รายการลูกค้าที่มีใบเสร็จ</h2>
        {customersWithReceipts.length === 0 ? (
          <div className="p-4 border rounded-lg text-center">
            ไม่พบข้อมูลลูกค้าที่มีใบเสร็จ
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customersWithReceipts.map((customer) => (
              <div
                key={customer.customer_id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleCustomerClick(customer)}
              >
                <p className="font-bold text-lg">{customer.cus_company_name}</p>
                <p>รหัสลูกค้า: {customer.customer_id}</p>
                <p>จำนวนใบเสร็จ: {customer.receiptCount} ใบ</p>
                <p>ยอดรวมทั้งสิ้น: {formatNumber(customer.totalAmount)} บาท</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Quotation Selection Modal */}
      {isCustomerModalOpen && selectedCustomer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay"
          onClick={handleCustomerOutsideClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto p-6">
            {/* Modal Header with close button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                รายการใบเสร็จของ {selectedCustomer.cus_company_name}
              </h2>
              <button
                onClick={closeCustomerModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Quotation List for this customer - แสดงเฉพาะหน้าปัจจุบัน */}
            <div className="divide-y">
              {paginatedReceipts.map((receipt) => (
                <div
                  key={receipt.receipt_id}
                  className="py-4 hover:bg-gray-50 cursor-pointer transition-colors px-3 rounded-lg"
                  onClick={() => handleReceiptSelect(receipt)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        เลขใบเสร็จ: {receipt.receipt_id}
                      </p>
                      <p>วันที่: {formatDate(receipt.date)}</p>
                      <p>
                        สถานะ:{" "}
                        <span
                          className={`font-bold ${
                            receipt.status === "approved"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {receipt.status === "approved"
                            ? "อนุมัติแล้ว"
                            : "รอการอนุมัติ"}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatNumber(receipt.total_all)} บาท
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls - แสดงเมื่อมีมากกว่า 5 รายการ */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() =>
                    paginate(currentPage > 1 ? currentPage - 1 : 1)
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  &laquo; ก่อนหน้า
                </button>

                {/* สร้างปุ่มหมายเลขหน้า */}
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    paginate(
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    )
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  ถัดไป &raquo;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quotation Detail Modal */}
      {isModalOpen && selectedReceipt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay"
          onClick={handleOutsideClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto p-6">
            {/* Modal Header with close button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">รายละเอียดใบเสร็จ</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Quotation Content */}
            <div className="bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold">ใบเสร็จ</h1>
                  <h2 className="text-lg">Receipt</h2>
                  <div className="mt-4">
                    {selectedCustomer && (
                      <>
                        <p>ผู้ออก {selectedCustomer.cus_company_name}</p>
                        <p>{selectedCustomer.cus_address}</p>
                        <p>
                          เลขประจำตัวผู้เสียภาษี {selectedCustomer.cus_tax_id}{" "}
                          โทร {selectedCustomer.cus_phone}
                        </p>
                      </>
                    )}
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
                  {selectedCustomer && (
                    <>
                      <p className="font-bold">
                        ลูกค้า {selectedCustomer.cus_company_name}
                      </p>
                      <p>ที่อยู่ {selectedCustomer.cus_address}</p>
                      <p>
                        เลขประจำตัวผู้เสียภาษี {selectedCustomer.cus_tax_id}
                      </p>
                      <p>โทร {selectedCustomer.cus_phone}</p>
                    </>
                  )}
                </div>
                <div className="p-4 border-l border-gray-300">
                  <p>เลขที่ใบเสร็จ: {selectedReceipt.receipt_id}</p>
                  <p>วันที่ {formatDate(selectedReceipt.date)}</p>
                  <p>
                    วันที่หมดอายุ {formatDate(selectedReceipt.expire_date)}
                  </p>
                  <p>เครดิต {selectedReceipt.credit_term} วัน</p>
                  <p>
                    สถานะ:{" "}
                    <span
                      className={`font-bold ${
                        selectedReceipt.status === "approved"
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      {selectedReceipt.status === "approved"
                        ? "อนุมัติแล้ว"
                        : "รอการอนุมัติ"}
                    </span>
                  </p>
                </div>
              </div>

              
              <table className="w-full mt-8 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray text-left p-2">ลำดับ</th>
                    <th className="border border-gray-300 p-2 text-left">
                      รายการ
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      จำนวน
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      ราคาต่อหน่วย
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      ส่วนลดราคา
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      ราคารวม
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReceipt.receipt_items &&
                  selectedReceipt.receipt_items.length > 0 ? (
                    selectedReceipt.receipt_items.map((item, index) => (
                      <tr key={item.item_id || index}>
                        <td className="border border-gray-300 p-2 text-left">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 p-2 text-left">
                          {getProductName(item)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {item.quantity} 
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {formatNumber(item.unit_price)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {formatNumber(item.discount)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {formatNumber(item.total)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="border border-gray-300 p-4 text-center text-gray-500"
                      >
                        ไม่พบข้อมูลรายการสินค้า
                      </td>
                    </tr>
                  )}
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
                      {formatNumber(selectedReceipt.subtotal)}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 p-2 text-right"
                    >
                      ส่วนลด {selectedReceipt.discount_rate}%
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatNumber(
                        selectedReceipt.subtotal -
                          selectedReceipt.total_after_discount
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 p-2 text-right"
                    >
                      ยอดรวมหลังหักส่วนลด
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatNumber(selectedReceipt.total_after_discount)}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 p-2 text-right"
                    >
                      ภาษีมูลค่าเพิ่ม {selectedReceipt.vat}%
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatNumber(selectedReceipt.vat_amount)}
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
                      {formatNumber(selectedReceipt.total_all)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 p-2 text-center"
                    >
                      {selectedReceipt.total_inthai}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="mt-8 p-4 border border-gray-300 rounded">
                <h3 className="font-bold mb-2">เงื่อนไขใบเสร็จ</h3>
                <ul className="list-disc pl-6">
                  <li>
                    ใบเสร็จราคานี้มีผลบังคับใช้ถึงวันที่{" "}
                    {formatDate(selectedReceipt.expire_date)}
                  </li>
                  <li>
                    ราคาไม่รวมค่าขนส่ง ค่าติดตั้ง และค่าบริการอื่นๆ เพิ่มเติม
                  </li>
                  <li>
                    เงื่อนไขการชำระเงิน: เครดิต {selectedReceipt.credit_term}{" "}
                    วัน
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-[60px] text-center">
                <div>
                  <div className="border-b border-gray-400 mb-2 h-8"></div>
                  <p>ลูกค้า</p>
                </div>
                <div>
                  <div className="border-b border-gray-400 mb-2 h-8"></div>
                  <p>ผู้เสนอราคา</p>
                </div>
              </div>

              {/* Print button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  พิมพ์ใบเสนอราคา
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipt;