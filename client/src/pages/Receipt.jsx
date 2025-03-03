import React, { useState, useEffect } from "react";
import logo from "../img/japanlogo.png";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";

const Receipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]); // เพิ่ม state สำหรับข้อมูลสินค้า
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editReceipt, setEditReceipt] = useState({ items: [] });
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [newReceipt, setNewReceipt] = useState({
    customer_id: "",
    date: new Date().toISOString().split("T")[0],
    expire_date: new Date(new Date().setDate(new Date().getDate() + 30))
      .toISOString()
      .split("T")[0],
    credit_term: 30,
    discount_rate: 0,
    items: [{ product_id: "", quantity: 1, discount: 0 }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // เพิ่ม state สำหรับ pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ReceiptsPerPage = 5;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (showEditModal && editReceipt) {
      // ถ้า items เป็น undefined ให้กำหนดค่าเริ่มต้น
      if (!editReceipt.items) {
        setEditReceipt((prev) => ({
          ...prev,
          items: [{ product_id: "", quantity: 1, discount: 0 }],
        }));
      }
    }
  }, [showEditModal, editReceipt]);

  // Handler for clicking outside the edit modal
  const handleEditModalOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setShowEditModal(false);
    }
  };

  // When opening the edit modal
  const openEditModal = (receipt) => {
    // ตรวจสอบและจัดรูปแบบข้อมูลให้ถูกต้อง
    const formattedReceipt = {
      ...receipt,
      items: Array.isArray(receipt.items)
        ? receipt.items.map((item) => ({
            ...item,
            product_id: item.product_id ? item.product_id.toString() : "", // ตรวจสอบว่า product_id มีค่าหรือไม่
            quantity: item.quantity || 1, // ตรวจสอบว่า quantity มีค่าหรือไม่
            discount: item.discount || 0, // ตรวจสอบว่า discount มีค่าหรือไม่
          }))
        : [{ product_id: "", quantity: 1, discount: 0 }], // หากไม่มี items ให้สร้าง array เปล่า
    };

    setEditReceipt(formattedReceipt);
    setShowEditModal(true);
  };

  // Handler for adding a new item to the edit form
  const addEditItem = () => {
    // Check if items exists and is an array
    if (!Array.isArray(editReceipt.items)) {
      setEditReceipt({
        ...editReceipt,
        items: [{ product_id: "", quantity: 1, discount: 0 }],
      });
    } else {
      setEditReceipt({
        ...editReceipt,
        items: [
          ...editReceipt.items,
          { product_id: "", quantity: 1, discount: 0 },
        ],
      });
    }
  };

  // Handler for removing an item from the edit form
  const removeEditItem = (index) => {
    if (editReceipt.items.length > 1) {
      const updatedItems = [...editReceipt.items];
      updatedItems.splice(index, 1);
      setEditReceipt({
        ...editReceipt,
        items: updatedItems,
      });
    }
  };

  const fetchReceipt = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/receipt");
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();
      const ReceiptList = data.listReceipt || [];
      setReceipts(ReceiptList);
    } catch (err) {
      console.error("Error fetching receipts:", err);
    }
  };

  useEffect(() => {
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
        return fetchReceipt(); // ใช้ฟังก์ชั่นที่สร้างขึ้นใหม่
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  // ดึงข้อมูลลูกค้า, สินค้า และใบเสนอราคา
  useEffect(() => {
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
        if (!res.ok) throw new Error("Failed to fetch invoices");
        return res.json();
      })
      .then((data) => {
        // รับข้อมูลใบเสนอราคาจากโครงสร้าง API
        const receiptList = data.listReceipt || [];
        setReceipts(receiptList);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleDeleteReceipt = async () => {
    const confirmDelete = window.confirm(
      "คุณแน่ใจหรือไม่ว่าต้องการลบใบเสร็จนี้?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/receipt/${selectedReceipt.receipt_id}`
      );

      if (response.status === 200) {
        alert("ลบใบเสร็จสำเร็จ");
        // อัปเดตรายการใบเสนอราคา
        const updatedReceipts = receipts.filter(
          (q) => q.receipt_id !== selectedReceipt.receipt_id
        );
        setReceipts(updatedReceipts);
        closeModal(); // ปิดโมดัลหลังจากลบ
      }
    } catch (error) {
      console.error("Error deleting receipt:", error);
      alert("เกิดข้อผิดพลาดในการลบใบเสร็จ");
    }
  };

  const handleEditClick = async (receiptId) => {
    try {
      // ดึงข้อมูลใบเสร็จที่ต้องการแก้ไข
      const response = await axios.get(`/api/receipts/${receiptId}`);

      // ตรวจสอบให้แน่ใจว่ามีการส่งรายการสินค้ากลับมาด้วย
      // อาจต้องเพิ่ม endpoint ให้ดึงรายการสินค้ามาพร้อมกับใบเสร็จ
      const receiptData = response.data;

      // ตรวจสอบว่ามีรายการสินค้า (items) หรือไม่
      if (!receiptData.items || receiptData.items.length === 0) {
        // ถ้าไม่มีรายการสินค้า ให้ดึงรายการสินค้าแยก
        const itemsResponse = await axios.get(
          `/api/receipts/${receiptId}/items`
        );
        receiptData.items = itemsResponse.data;
      }

      // กำหนดค่าให้ editReceipt พร้อมรายการสินค้า
      setEditReceipt(receiptData);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching receipt data:", error);
      toast.error("ไม่สามารถดึงข้อมูลใบเสร็จได้");
    }
  };

  const handleEditReceiptChange = (e) => {
    const { name, value } = e.target;
    setEditReceipt((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for changing item values in the edit form
  const handleEditItemChange = (index, field, value) => {
    const updatedItems = [...editReceipt.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]:
        field === "quantity" || field === "discount" ? Number(value) : value,
    };
    setEditReceipt({
      ...editReceipt,
      items: updatedItems,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/receipt/${editReceipt.receipt_id}`,
        editReceipt
      );

      if (response.status === 200) {
        alert("แก้ไขใบเสร็จสำเร็จ");

        // เรียกใช้ฟังก์ชั่นดึงข้อมูลใหม่หลังจากอัพเดตสำเร็จ
        await fetchReceipt();

        setShowEditModal(false); // ปิดโมดัลแก้ไข
      }
    } catch (error) {
      console.error("Error updating receipt:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขใบเสร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Function to format dates for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    try {
      // Convert the date string to a Date object
      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "";
      }

      // Format as YYYY-MM-DD
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
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
    const customerReceipt = receipts.filter(
      (receipt) => receipt.customer_id === receipt.customer_id
    );

    if (customerReceipt.length === 1) {
      setSelectedReceipt(customerReceipt[0]);
      setIsModalOpen(true);
    } else if (customerReceipt.length > 1) {
      // ถ้ามีหลายใบเสนอราคา เปิด modal ให้เลือกใบเสนอราคาก่อน
      setIsCustomerModalOpen(true);
    } else {
      // ไม่มีใบเสนอราคา
      alert("ไม่พบใบเสร็จสำหรับลูกค้ารายนี้");
    }
  };

  const handleReceiptSelect = (receipt) => {
    setSelectedReceipt(receipt);
    setIsCustomerModalOpen(false);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);

    setNewReceipt({
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

  const closeAddedReceiptModal = () => {
    setShowAddedReceipt(false);
    setAddedReceipt(null);
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

  const handleAddedReceiptOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeAddedReceiptModal();
    }
  };

  const handleNewReceiptChange = (e) => {
    const { name, value } = e.target;
    setNewReceipt((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newReceipt.items];
    updatedItems[index][field] =
      field === "product_id" || field === "quantity"
        ? parseFloat(value, 10) || ""
        : parseFloat(value) || 0;

    setNewReceipt((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addNewItem = () => {
    setNewReceipt((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: "", quantity: 1, discount: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (newReceipt.items.length > 1) {
      const updatedItem = newReceipt.items.filter((item, i) => i !== index);
      setNewReceipt((prev) => ({
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
      if (!newReceipt.customer_id) {
        alert("กรุณาเลือกลูกค้า");
        setIsSubmitting(false);
        return;
      }

      // ตรวจสอบรายการสินค้า
      for (const item of newReceipt.items) {
        if (!item.product_id) {
          alert("กรุณาเลือกสินค้าให้ครบทุกรายการ");
          setIsSubmitting(false);
          return;
        }
      }

      // เตรียมข้อมูลสำหรับส่ง API
      const payload = {
        customer_id: parseInt(newReceipt.customer_id, 10),
        date: newReceipt.date,
        expire_date: newReceipt.expire_date,
        credit_term: parseInt(newReceipt.credit_term, 10),
        discount_rate: parseFloat(newReceipt.discount_rate),
        items: newReceipt.items.map((item) => ({
          product_id: parseInt(item.product_id, 10),
          quantity: parseInt(item.quantity, 10),
          discount: parseFloat(item.discount),
        })),
      };

      // ส่งข้อมูลไปยัง API
      const response = await fetch("http://localhost:8080/api/receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add receipt");
      }

      const result = await response.json();

      // ถ้าเพิ่มสำเร็จ ดึงข้อมูลใบเสนอราคาล่าสุด
      const ReceiptResponse = await fetch("http://localhost:8080/api/receipt");
      const ReceiptData = await ReceiptResponse.json();
      setReceipts(ReceiptData.listReceipt || []);

      // หาใบเสนอราคาที่เพิ่งเพิ่ม
      const newlyAddedReceipt = ReceiptData.listReceipt.find(
        (q) =>
          q.customer_id === parseInt(newReceipt.customer_id, 10) &&
          q.date === newReceipt.date
      );

      if (newlyAddedReceipt) {
        setAddedReceipt(newlyAddedReceipt);
        setIsAddModalOpen(false);
        setShowAddedReceipt(true);
      } else {
        alert("เพิ่มใบเสร็จสำเร็จ");
        closeAddModal();
      }
    } catch (error) {
      console.error("Error adding invoice:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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
    const indexOfLastReceipt = currentPage * ReceiptsPerPage;
    const indexOfFirstReceipt = indexOfLastReceipt - ReceiptsPerPage;

    // ส่งคืนเฉพาะรายการในหน้าปัจจุบัน
    return customerReceipts.slice(indexOfFirstReceipt, indexOfLastReceipt);
  };

  // เปลี่ยนหน้า
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // คำนวณจำนวนหน้าทั้งหมด
  const getPageCount = () => {
    if (!selectedCustomer) return 0;

    const customerReceipts = receipts.filter(
      (receipt) => receipt.customer_id === selectedCustomer.customer_id
    );

    return Math.ceil(customerReceipts.length / ReceiptsPerPage);
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
      <div className="flex justify-between items-center mb-4 p-4">
        <h2 className="text-xl font-bold">รายการลูกค้าที่มีใบเสร็จ</h2>
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
          เพิ่มใบเสร็จ
        </button>
      </div>
      {/* Customer List */}
      <div className="mb-8 p-4">
        <h2 className="text-xl font-bold mb-4"></h2>
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
                              : receipt.status === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {receipt.status === "approved"
                            ? "อนุมัติแล้ว"
                            : receipt.status === "rejected"
                            ? "ปฏิเสธ"
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
              <div className="flex space-x-2">
                {/* ปุ่มแก้ไข */}
                <button
                  onClick={() => {
                    setEditReceipt(selectedReceipt);
                    setShowEditModal(true);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                >
                  <Edit className="inline-block mr-2" size={16} />
                  แก้ไข
                </button>
                {/* ปุ่มลบ */}
                <button
                  onClick={handleDeleteReceipt}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="inline-block mr-2" size={16} />
                  ลบ
                </button>
                {/* ปุ่มปิด */}
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
                  <p>เลขที่ใบเสร็จ: {selectedReceipt.invoice_id}</p>
                  <p>วันที่ {formatDate(selectedReceipt.date)}</p>
                  <p>วันที่หมดอายุ {formatDate(selectedReceipt.expire_date)}</p>
                  <p>เครดิต {selectedReceipt.credit_term} วัน</p>
                  <p>
                    สถานะ:{" "}
                    <span
                      className={`font-bold ${
                        selectedReceipt.status === "approved"
                          ? "text-green-600"
                          : selectedReceipt.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {selectedReceipt.status === "approved"
                        ? "อนุมัติแล้ว"
                        : selectedReceipt.status === "rejected"
                        ? "ปฏิเสธ"
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
                <h3 className="font-bold mb-2">เงื่อนไขการเสนอราคา</h3>
                <ul className="list-disc pl-6">
                  <li>
                    ใบเสร็จนี้มีผลบังคับใช้ถึงวันที่{" "}
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
                  พิมพ์ใบเสร็จ
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
              <h2 className="text-xl font-bold">เพิ่มใบเสร็จ</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-1 font-medium">
                    เลือกลูกค้า *
                  </label>
                  <select
                    name="customer_id"
                    value={newReceipt.customer_id}
                    onChange={handleNewReceiptChange}
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
                    value={newReceipt.date}
                    onChange={handleNewReceiptChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">วันหมดอายุ *</label>
                  <input
                    type="date"
                    name="expire_date"
                    value={newReceipt.expire_date}
                    onChange={handleNewReceiptChange}
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
                    value={newReceipt.credit_term}
                    onChange={handleNewReceiptChange}
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
                    value={newReceipt.discount_rate}
                    onChange={handleNewReceiptChange}
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
                      {newReceipt.items.map((item, index) => (
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
                              disabled={newReceipt.items.length === 1}
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

      {showEditModal && editReceipt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay"
          onClick={handleEditModalOutsideClick}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with close button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">แก้ไขใบเสร็จ</h2>
              <button
                onClick={() => setShowEditModal(false)}
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

            {/* Edit Quotation Form */}
            <form onSubmit={handleEditSubmit}>
              {/* ข้อมูลใบเสนอราคา */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-1 font-medium">
                    เลือกลูกค้า *
                  </label>
                  <select
                    name="customer_id"
                    value={editReceipt.customer_id || ""}
                    onChange={handleEditReceiptChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">-- เลือกลูกค้า --</option>
                    {customers && customers.length > 0
                      ? customers.map((customer) => (
                          <option
                            key={customer.customer_id}
                            value={customer.customer_id}
                          >
                            {customer.cus_company_name}
                          </option>
                        ))
                      : null}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium">วันที่ *</label>
                  <input
                    type="date"
                    name="date"
                    value={formatDateForInput(editReceipt.date)}
                    onChange={handleEditReceiptChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">วันหมดอายุ *</label>
                  <input
                    type="date"
                    name="expire_date"
                    value={formatDateForInput(editReceipt.expire_date)}
                    onChange={handleEditReceiptChange}
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
                    value={editReceipt.credit_term || 0}
                    onChange={handleEditReceiptChange}
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
                    value={editReceipt.discount_rate || 0}
                    onChange={handleEditReceiptChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">สถานะ</label>
                  <select
                    name="status"
                    value={editReceipt.status || ""}
                    onChange={handleEditReceiptChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="pending">รออนุมัติ</option>
                    <option value="approved">อนุมัติแล้ว</option>
                    <option value="rejected">ปฏิเสธ</option>
                  </select>
                </div>
              </div>

              {/* รายการสินค้า */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">รายการสินค้า</h3>
                  <button
                    type="button"
                    onClick={addEditItem}
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
                      {editReceipt.items &&
                      Array.isArray(editReceipt.items) &&
                      editReceipt.items.length > 0 ? (
                        editReceipt.items.map((item, index) => (
                          <tr key={index}>
                            <td className="p-2 border">
                              <select
                                value={item.product_id || ""}
                                onChange={(e) =>
                                  handleEditItemChange(
                                    index,
                                    "product_id",
                                    e.target.value
                                  )
                                }
                                className="w-full p-1 border rounded"
                                required
                              >
                                <option value="">-- เลือกสินค้า --</option>
                                {products && products.length > 0
                                  ? products.map((product) => (
                                      <option
                                        key={product.product_id}
                                        value={product.product_id}
                                      >
                                        {product.name}
                                      </option>
                                    ))
                                  : null}
                              </select>
                            </td>
                            <td className="p-2 border">
                              <input
                                type="number"
                                value={item.quantity || 1}
                                onChange={(e) =>
                                  handleEditItemChange(
                                    index,
                                    "quantity",
                                    Number(e.target.value)
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
                                value={item.discount || 0}
                                onChange={(e) =>
                                  handleEditItemChange(
                                    index,
                                    "discount",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full p-1 border rounded text-center"
                                min="0"
                              />
                            </td>
                            <td className="p-2 border text-center">
                              <button
                                type="button"
                                onClick={() => removeEditItem(index)}
                                className="text-red-500 hover:text-red-700"
                                disabled={
                                  !Array.isArray(editReceipt.items) ||
                                  editReceipt.items.length <= 1
                                }
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="p-2 border text-center">
                            ไม่มีรายการสินค้า
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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

export default Receipt;
