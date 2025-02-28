import React from "react";
import logo from "../img/japanlogo.png";

const Invoice = () => {
  const [invoices, setInvoices] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [invoiceItems, setInvoiceItems] = React.useState([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const invoicesPerPage = 5;

  // Fetch customer, product, and invoice data
  React.useEffect(() => {
    // Fetch customers first
    fetch("http://localhost:8080/api/customer")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch customers");
        return res.json();
      })
      .then((data) => {
        const customerlist = data.listCustomer || [];
        setCustomers(customerlist);

        // Then fetch products
        return fetch("http://localhost:8080/api/product");
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        const productsList = data || [];
        setProducts(productsList);

        // Finally fetch invoices
        return fetch("http://localhost:8080/api/invoice");
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch invoices");
        return res.json();
      })
      .then((data) => {
        const invoicesList = data.listInvoice || [];
        setInvoices(invoicesList);
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
      maximumFractionDigits: 2,
    });
  };

  // Find customer by ID
  const findCustomerById = (customerId) => {
    return (
      customers.find((customer) => customer.customer_id === customerId) || {}
    );
  };

  // Find product by ID
  const findProductById = (productId) => {
    const product = products.find(
      (product) => product.product_id === Number(productId)
    );
    return product || {};
  };

  // Get product name
  const getProductName = (item) => {
    if (item.product_id) {
      const product = findProductById(item.product_id);
      return product.name || "ไม่พบข้อมูลสินค้า";
    }
    return item.name || "ไม่ระบุชื่อสินค้า";
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setCurrentPage(1); // Reset page when selecting a new customer

    // Find invoices for this customer
    const customerInvoices = invoices.filter(
      (invoice) => invoice.customer_id === customer.customer_id
    );

    if (customerInvoices.length === 1) {
      setSelectedInvoice(customerInvoices[0]);
      setIsModalOpen(true);
    } else if (customerInvoices.length > 1) {
      // If there are multiple invoices, open modal to select one
      setIsCustomerModalOpen(true);
    } else {
      // No invoices
      alert("ไม่พบใบแจ้งหนี้สำหรับลูกค้ารายนี้");
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

  // Close modal when clicking outside
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

  // Group invoices by customer
  const getCustomersWithInvoices = () => {
    const customerMap = {};

    invoices.forEach((invoice) => {
      const customerId = invoice.customer_id;

      if (!customerMap[customerId]) {
        const customerData = findCustomerById(customerId);
        customerMap[customerId] = {
          ...customerData,
          invoiceCount: 1,
          totalAmount: parseFloat(invoice.total_all || 0),
        };
      } else {
        customerMap[customerId].invoiceCount += 1;
        customerMap[customerId].totalAmount += parseFloat(
          invoice.total_all || 0
        );
      }
    });

    return Object.values(customerMap);
  };

  // Calculate data for pagination
  const getPaginatedInvoices = () => {
    if (!selectedCustomer) return [];

    // Filter invoices for selected customer
    const customerInvoices = invoices.filter(
      (invoice) => invoice.customer_id === selectedCustomer.customer_id
    );

    // Calculate offset
    const indexOfLastInvoice = currentPage * invoicesPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;

    // Return only items for current page
    return customerInvoices.slice(
      indexOfFirstInvoice,
      indexOfLastInvoice
    );
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const getPageCount = () => {
    if (!selectedCustomer) return 0;

    const customerInvoices = invoices.filter(
      (invoice) => invoice.customer_id === selectedCustomer.customer_id
    );

    return Math.ceil(customerInvoices.length / invoicesPerPage);
  };

  const customersWithInvoices = getCustomersWithInvoices();
  const paginatedInvoices = getPaginatedInvoices();
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
        <h2 className="text-xl font-bold mb-4">รายการลูกค้าที่มีใบแจ้งหนี้</h2>
        {customersWithInvoices.length === 0 ? (
          <div className="p-4 border rounded-lg text-center">
            ไม่พบข้อมูลลูกค้าที่มีใบแจ้งหนี้
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customersWithInvoices.map((customer) => (
              <div
                key={customer.customer_id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleCustomerClick(customer)}
              >
                <p className="font-bold text-lg">{customer.cus_company_name}</p>
                <p>รหัสลูกค้า: {customer.customer_id}</p>
                <p>จำนวนใบแจ้งหนี้: {customer.invoiceCount} ใบ</p>
                <p>ยอดรวมทั้งสิ้น: {formatNumber(customer.totalAmount)} บาท</p>
              </div>
            ))}
          </div>
        )}
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
              <h2 className="text-xl font-bold">
                รายการใบแจ้งหนี้ของ {selectedCustomer.cus_company_name}
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

            {/* Invoice List for this customer - show only current page */}
            <div className="divide-y">
              {paginatedInvoices.map((invoice) => (
                <div
                  key={invoice.invoice_id}
                  className="py-4 hover:bg-gray-50 cursor-pointer transition-colors px-3 rounded-lg"
                  onClick={() => handleInvoiceSelect(invoice)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        เลขใบแจ้งหนี้: {invoice.invoice_id}
                      </p>
                      <p>วันที่: {formatDate(invoice.date)}</p>
                      <p>
                        สถานะ:{" "}
                        <span
                          className={`font-bold ${
                            invoice.status === "paid"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {invoice.status === "paid"
                            ? "ชำระแล้ว"
                            : "รอการชำระ"}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatNumber(invoice.total_all)} บาท
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls - show when there are more than 5 items */}
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

                {/* Create page number buttons */}
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

            {/* Invoice Content */}
            <div className="bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold">ใบแจ้งหนี้</h1>
                  <h2 className="text-lg">Invoice</h2>
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
                  <p>เลขที่ใบแจ้งหนี้: {selectedInvoice.invoice_id}</p>
                  <p>วันที่ {formatDate(selectedInvoice.date)}</p>
                  <p>
                    วันครบกำหนดชำระ {formatDate(selectedInvoice.due_date)}
                  </p>
                  <p>เครดิต {selectedInvoice.credit_term} วัน</p>
                  <p>
                    สถานะ:{" "}
                    <span
                      className={`font-bold ${
                        selectedInvoice.status === "paid"
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      {selectedInvoice.status === "paid"
                        ? "ชำระแล้ว"
                        : "รอการชำระ"}
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
                  {selectedInvoice.invoice_items &&
                  selectedInvoice.invoice_items.length > 0 ? (
                    selectedInvoice.invoice_items.map((item, index) => (
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
                        colSpan="6"
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
                      {formatNumber(selectedInvoice.subtotal)}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 p-2 text-right"
                    >
                      ส่วนลด {selectedInvoice.discount_rate}%
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatNumber(
                        selectedInvoice.subtotal -
                          selectedInvoice.total_after_discount
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
                      {formatNumber(selectedInvoice.total_after_discount)}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 p-2 text-right"
                    >
                      ภาษีมูลค่าเพิ่ม {selectedInvoice.vat}%
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatNumber(selectedInvoice.vat_amount)}
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
                      {formatNumber(selectedInvoice.total_all)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="6"
                      className="border border-gray-300 p-2 text-center"
                    >
                      {selectedInvoice.total_inthai}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="mt-8 p-4 border border-gray-300 rounded">
                <h3 className="font-bold mb-2">เงื่อนไขการชำระเงิน</h3>
                <ul className="list-disc pl-6">
                  <li>
                    กำหนดชำระเงินภายในวันที่{" "}
                    {formatDate(selectedInvoice.due_date)}
                  </li>
                  <li>
                    กรุณาชำระเงินโดยการโอนเงินเข้าบัญชีธนาคาร หรือเช็คขีดคร่อม
                  </li>
                  <li>
                    เงื่อนไขการชำระเงิน: เครดิต {selectedInvoice.credit_term}{" "}
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
                  <p>ผู้ออกใบแจ้งหนี้</p>
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