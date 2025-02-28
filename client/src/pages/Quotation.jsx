import React from "react";
import logo from "../img/japanlogo.png";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";

const Quotation = () => {
  const [quotations, setQuotations] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);
  const [products, setProducts] = React.useState([]); // เพิ่ม state สำหรับข้อมูลสินค้า
  const [quotationItems, setQuotationItems] = React.useState([]);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [selectedQuotation, setSelectedQuotation] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);
  const [editQuotation, setEditQuotation] = React.useState(null);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [newQuotation, setNewQuotation] = React.useState({
    customer_id: "",
    date: new Date().toISOString().split("T")[0],
    expire_date: new Date(new Date().setDate(new Date().getDate() + 30))
      .toISOString()
      .split("T")[0],
    credit_term: 30,
    discount_rate: 0,
    items: [{ product_id: "", quantity: 1, discount: 0 }],
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // เพิ่ม state สำหรับ pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const quotationsPerPage = 5;

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
        return fetch("http://localhost:8080/api/quotation");
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch quotations");
        return res.json();
      })
      .then((data) => {
        // รับข้อมูลใบเสนอราคาจากโครงสร้าง API
        const quotationsList = data.listQuotation || [];
        setQuotations(quotationsList);
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
    const product = products.find(
      (product) => product.product_id === Number(productId)
    );
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
    const customerQuotations = quotations.filter(
      (quotation) => quotation.customer_id === customer.customer_id
    );

    if (customerQuotations.length === 1) {
      setSelectedQuotation(customerQuotations[0]);
      setIsModalOpen(true);
    } else if (customerQuotations.length > 1) {
      // ถ้ามีหลายใบเสนอราคา เปิด modal ให้เลือกใบเสนอราคาก่อน
      setIsCustomerModalOpen(true);
    } else {
      // ไม่มีใบเสนอราคา
      alert("ไม่พบใบเสนอราคาสำหรับลูกค้ารายนี้");
    }
  };

  const handleQuotationSelect = (quotation) => {
    setSelectedQuotation(quotation);
    setIsCustomerModalOpen(false);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);

    setNewQuotation({
      customer_id: "",
      date: new Date().toISOString().split("T")[0],
      expire_date: new Date(new Date().setDate(new Date().getDate() + 30))
        .toISOString()
        .split("T")[0],
      credit_term: 30,
      discount_rate: 0,
      items: [{ product_id: "", quantity: 1, discount: 0 }],
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
  };

  const closeAddedQuotationModal = () => {
    setShowAddedQuotation(false);
    setAddedQuotation(null);
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

  const handleAddModalOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeAddModal();
    }
  };

  const handleAddedQuotationOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeAddedQuotationModal();
    }
  };

  const handleNewQuotationChange = (e) => {
    const { name, value } = e.target;
    setNewQuotation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newQuotation.items];
    updatedItems[index][field] =
      field === "product_id" || field === "quantity"
        ? parseFloat(value, 10) || ""
        : parseFloat(value) || 0;

    setNewQuotation((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addNewItem = () => {
    setNewQuotation((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: 1, discount: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (newQuotation.items.length > 1) {
      const updatedItem = newQuotation.items.filter((item, i) => i !== index);
      setNewQuotation((prev) => ({
        ...prev,
        items: updatedItem,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ตรวจสอบข้อมูลก่อนส่ง
      if (!newQuotation.customer_id) {
        alert("กรุณาเลือกลูกค้า");
        setIsSubmitting(false);
        return;
      }

      // ตรวจสอบรายการสินค้า
      for (const item of newQuotation.items) {
        if (!item.product_id) {
          alert("กรุณาเลือกสินค้าให้ครบทุกรายการ");
          setIsSubmitting(false);
          return;
        }
      }

      // เตรียมข้อมูลสำหรับส่ง API
      const payload = {
        customer_id: parseInt(newQuotation.customer_id, 10),
        date: newQuotation.date,
        expire_date: newQuotation.expire_date,
        credit_term: parseInt(newQuotation.credit_term, 10),
        discount_rate: parseFloat(newQuotation.discount_rate),
        items: newQuotation.items.map((item) => ({
          product_id: parseInt(item.product_id, 10),
          quantity: parseInt(item.quantity, 10),
          discount: parseFloat(item.discount),
        })),
      };

      // ส่งข้อมูลไปยัง API
      const response = await fetch("http://localhost:8080/api/quotation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add quotation");
      }

      const result = await response.json();

      // ถ้าเพิ่มสำเร็จ ดึงข้อมูลใบเสนอราคาล่าสุด
      const quotationResponse = await fetch(
        "http://localhost:8080/api/quotation"
      );
      const quotationData = await quotationResponse.json();
      setQuotations(quotationData.listQuotation || []);

      // หาใบเสนอราคาที่เพิ่งเพิ่ม
      const newlyAddedQuotation = quotationData.listQuotation.find(
        (q) =>
          q.customer_id === parseInt(newQuotation.customer_id, 10) &&
          q.date === newQuotation.date
      );

      if (newlyAddedQuotation) {
        setAddedQuotation(newlyAddedQuotation);
        setIsAddModalOpen(false);
        setShowAddedQuotation(true);
      } else {
        alert("เพิ่มใบเสนอราคาสำเร็จ");
        closeAddModal();
      }
    } catch (error) {
      console.error("Error adding quotation:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // จัดกลุ่มใบเสนอราคาตามลูกค้า
  const getCustomersWithQuotations = () => {
    const customerMap = {};

    quotations.forEach((quotation) => {
      const customerId = quotation.customer_id;

      if (!customerMap[customerId]) {
        const customerData = findCustomerById(customerId);
        customerMap[customerId] = {
          ...customerData,
          quotationCount: 1,
          totalAmount: parseFloat(quotation.total_all || 0),
        };
      } else {
        customerMap[customerId].quotationCount += 1;
        customerMap[customerId].totalAmount += parseFloat(
          quotation.total_all || 0
        );
      }
    });

    return Object.values(customerMap);
  };

  // คำนวณข้อมูลสำหรับ pagination
  const getPaginatedQuotations = () => {
    if (!selectedCustomer) return [];

    // กรองใบเสนอราคาของลูกค้าที่เลือก
    const customerQuotations = quotations.filter(
      (quotation) => quotation.customer_id === selectedCustomer.customer_id
    );

    // คำนวณ offset
    const indexOfLastQuotation = currentPage * quotationsPerPage;
    const indexOfFirstQuotation = indexOfLastQuotation - quotationsPerPage;

    // ส่งคืนเฉพาะรายการในหน้าปัจจุบัน
    return customerQuotations.slice(
      indexOfFirstQuotation,
      indexOfLastQuotation
    );
  };

  // เปลี่ยนหน้า
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // คำนวณจำนวนหน้าทั้งหมด
  const getPageCount = () => {
    if (!selectedCustomer) return 0;

    const customerQuotations = quotations.filter(
      (quotation) => quotation.customer_id === selectedCustomer.customer_id
    );

    return Math.ceil(customerQuotations.length / quotationsPerPage);
  };

  const customersWithQuotations = getCustomersWithQuotations();
  const paginatedQuotations = getPaginatedQuotations();
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
      <div className="flex justify-between items-center mb-4 p-4">
        <h2 className="text-xl font-bold">รายการลูกค้าที่มีใบเสนอราคา</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          เพิ่มใบเสนอราคา
        </button>
      </div>
      {/* Customer List */}
      <div className="mb-8 p-4">
        <h2 className="text-xl font-bold mb-4">รายการลูกค้าที่มีใบเสนอราคา</h2>
        {customersWithQuotations.length === 0 ? (
          <div className="p-4 border rounded-lg text-center">
            ไม่พบข้อมูลลูกค้าที่มีใบเสนอราคา
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customersWithQuotations.map((customer) => (
              <div
                key={customer.customer_id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleCustomerClick(customer)}
              >
                <p className="font-bold text-lg">{customer.cus_company_name}</p>
                <p>รหัสลูกค้า: {customer.customer_id}</p>
                <p>จำนวนใบเสนอราคา: {customer.quotationCount} ใบ</p>
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
                รายการใบเสนอราคาของ {selectedCustomer.cus_company_name}
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
              {paginatedQuotations.map((quotation) => (
                <div
                  key={quotation.quotation_id}
                  className="py-4 hover:bg-gray-50 cursor-pointer transition-colors px-3 rounded-lg"
                  onClick={() => handleQuotationSelect(quotation)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        เลขใบเสนอราคา: {quotation.quotation_id}
                      </p>
                      <p>วันที่: {formatDate(quotation.date)}</p>
                      <p>
                        สถานะ:{" "}
                        <span
                          className={`font-bold ${
                            quotation.status === "approved"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {quotation.status === "approved"
                            ? "อนุมัติแล้ว"
                            : "รอการอนุมัติ"}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatNumber(quotation.total_all)} บาท
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
      {isModalOpen && selectedQuotation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay"
          onClick={handleOutsideClick}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto p-6">
            {/* Modal Header with close button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">รายละเอียดใบเสนอราคา</h2>
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
                  <h1 className="text-xl font-bold">ใบเสนอราคา</h1>
                  <h2 className="text-lg">Quotation</h2>
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
                  <p>เลขที่ใบเสนอราคา: {selectedQuotation.quotation_id}</p>
                  <p>วันที่ {formatDate(selectedQuotation.date)}</p>
                  <p>
                    วันที่หมดอายุ {formatDate(selectedQuotation.expire_date)}
                  </p>
                  <p>เครดิต {selectedQuotation.credit_term} วัน</p>
                  <p>
                    สถานะ:{" "}
                    <span
                      className={`font-bold ${
                        selectedQuotation.status === "approved"
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      {selectedQuotation.status === "approved"
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
                  {selectedQuotation.quotation_items &&
                  selectedQuotation.quotation_items.length > 0 ? (
                    selectedQuotation.quotation_items.map((item, index) => (
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
                      {formatNumber(selectedQuotation.subtotal)}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 p-2 text-right"
                    >
                      ส่วนลด {selectedQuotation.discount_rate}%
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatNumber(
                        selectedQuotation.subtotal -
                          selectedQuotation.total_after_discount
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
                      {formatNumber(selectedQuotation.total_after_discount)}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 p-2 text-right"
                    >
                      ภาษีมูลค่าเพิ่ม {selectedQuotation.vat}%
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {formatNumber(selectedQuotation.vat_amount)}
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
                      {formatNumber(selectedQuotation.total_all)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 p-2 text-center"
                    >
                      {selectedQuotation.total_inthai}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="mt-8 p-4 border border-gray-300 rounded">
                <h3 className="font-bold mb-2">เงื่อนไขการเสนอราคา</h3>
                <ul className="list-disc pl-6">
                  <li>
                    ใบเสนอราคานี้มีผลบังคับใช้ถึงวันที่{" "}
                    {formatDate(selectedQuotation.expire_date)}
                  </li>
                  <li>
                    ราคาไม่รวมค่าขนส่ง ค่าติดตั้ง และค่าบริการอื่นๆ เพิ่มเติม
                  </li>
                  <li>
                    เงื่อนไขการชำระเงิน: เครดิต {selectedQuotation.credit_term}{" "}
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

      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay"
          onClick={handleAddModalOutsideClick}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with close button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">เพิ่มใบเสนอราคา</h2>
              <button
                onClick={closeAddModal}
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

            {/* Add Quotation Form */}
            <form onSubmit={handleSubmit}>
              {/* ข้อมูลใบเสนอราคา */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-1 font-medium">
                    เลือกลูกค้า *
                  </label>
                  <select
                    name="customer_id"
                    value={newQuotation.customer_id}
                    onChange={handleNewQuotationChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">-- เลือกลูกค้า --</option>
                    {customers.map((customer) => (
                      <option
                        key={customer.customer_id}
                        value={customer.customer_id}
                      >
                        {customer.cus_company_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium">วันที่ *</label>
                  <input
                    type="date"
                    name="date"
                    value={newQuotation.date}
                    onChange={handleNewQuotationChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">วันหมดอายุ *</label>
                  <input
                    type="date"
                    name="expire_date"
                    value={newQuotation.expire_date}
                    onChange={handleNewQuotationChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    เครดิต (วัน) *
                  </label>
                  <input
                    type="number"
                    name="credit_term"
                    value={newQuotation.credit_term}
                    onChange={handleNewQuotationChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">ส่วนลด (%) *</label>
                  <input
                    type="number"
                    name="discount_rate"
                    value={newQuotation.discount_rate}
                    onChange={handleNewQuotationChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* รายการสินค้า */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">รายการสินค้า</h3>
                  <button
                    type="button"
                    onClick={addNewItem}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    + เพิ่มรายการ
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 border text-left">สินค้า *</th>
                        <th className="p-2 border text-center">จำนวน *</th>
                        <th className="p-2 border text-center">ส่วนลด</th>
                        <th className="p-2 border text-center w-16">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newQuotation.items.map((item, index) => (
                        <tr key={index}>
                          <td className="p-2 border">
                            <select
                              value={item.product_id}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "product_id",
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border rounded"
                              required
                            >
                              <option value="">-- เลือกสินค้า --</option>
                              {products.map((product) => (
                                <option
                                  key={product.product_id}
                                  value={product.product_id}
                                >
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2 border">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border rounded text-center"
                              min="1"
                              required
                            />
                          </td>
                          <td className="p-2 border">
                            <input
                              type="number"
                              value={item.discount}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "discount",
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border rounded text-center"
                              min="0"
                            />
                          </td>
                          <td className="p-2 border text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700"
                              disabled={newQuotation.items.length === 1}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-4 py-2 border rounded mr-2 hover:bg-gray-100 transition-colors"
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotation;
