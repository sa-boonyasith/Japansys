import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Edit2,
  Trash2,
  X,
  Plus,
  Search,
  Building2,
  Phone,
  UserCircle,
} from "lucide-react";

const AddCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filters, setFilters] = useState({
    cus_company_name: "",
  });

  const initialFormData = {
    cus_company_name: "",
    contact_name: "",
    cus_position: "",
    cus_address: "",
    cus_phone: "",
    cus_tax_id: "",
    cus_bankname: "",
    cus_banknumber: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/customer");
      setCustomers(response.data.listCustomer);
      setFilteredCustomers(response.data.listCustomer);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/customer", formData);
      closeAddModal();
      fetchCustomers();
    } catch (err) {
      console.error("Error adding customer:", err);
    }
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setFormData(initialFormData);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFormData(initialFormData);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/customer/${selectedCustomer.customer_id}`,
        formData
      );
      closeEditModal();
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/customer/${selectedCustomer.customer_id}`
      );
      setIsDeleteModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    applyFilters({ ...filters, [name]: value });
  };

  const applyFilters = (currentFilters) => {
    let filtered = customers.filter((cus) =>
      cus.cus_company_name
        .toLowerCase()
        .includes(currentFilters.cus_company_name.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setFormData(customer);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  // เพิ่มฟังก์ชันใหม่สำหรับจัดการรูปแบบเบอร์โทร
  const formatPhoneNumber = (value) => {
    const number = value.replace(/[^\d]/g, "");
    if (number.length <= 3) return number;
    if (number.length <= 6) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  // เพิ่มฟังก์ชันสำหรับตรวจสอบเลขประจำตัวผู้เสียภาษี
  const formatTaxId = (value) => {
    // ลบทุกอย่างที่ไม่ใช่ตัวเลข
    return value.replace(/[^\d]/g, "").slice(0, 13);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cus_phone") {
      // จัดการกับเบอร์โทร
      const formattedPhone = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedPhone,
      }));
    } else if (name === "cus_tax_id") {
      // จัดการกับเลขประจำตัวผู้เสียภาษี
      const formattedTaxId = formatTaxId(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedTaxId,
      }));
    } else {
      // สำหรับ input อื่นๆ
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">
            รายชื่อลูกค้า
          </h2>
          <div className="flex  justify-between">
            <input
              type="text"
              name="cus_company_name"
              value={filters.cus_company_name}
              onChange={handleFilterChange}
              placeholder="ค้นหาชื่อบริษัท..."
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Plus className="mr-2" size={18} /> เพิ่มลูกค้า
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 rounded-lg">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">
                    ชื่อบริษัท
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">
                    ตำแหน่ง
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">
                    เบอร์โทรศัพท์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">
                    ชื่อผู้ติดต่อ
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 border-b">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.customer_id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {customer.cus_company_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {customer.cus_position}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {customer.cus_phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {customer.contact_name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-4">
                          <button
                            onClick={() => openEditModal(customer)}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(customer)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center overflow-auto justify-center p-4 z-50 ">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">เพิ่มลูกค้าใหม่</h3>
              <button
                onClick={closeAddModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อบริษัท
                  </label>
                  <input
                    type="text"
                    name="cus_company_name"
                    value={formData.cus_company_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อผู้ติดต่อ
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ตำแหน่ง
                  </label>
                  <input
                    type="text"
                    name="cus_position"
                    value={formData.cus_position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ที่อยู่
                  </label>
                  <textarea
                    name="cus_address"
                    value={formData.cus_address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="text"
                    name="cus_phone"
                    value={formData.cus_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เลขประจำตัวผู้เสียภาษี
                  </label>
                  <input
                    type="text"
                    name="cus_tax_id"
                    value={formData.cus_tax_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เลขบัญชี
                  </label>
                  <input
                    type="text"
                    name="cus_banknumber"
                    value={formData.cus_banknumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อธนาคาร
                  </label>
                  <input
                    type="text"
                    name="cus_bankname"
                    value={formData.cus_bankname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  เพิ่มลูกค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">แก้ไขข้อมูลลูกค้า</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEdit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อบริษัท
                  </label>
                  <input
                    type="text"
                    name="cus_company_name"
                    value={formData.cus_company_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อผู้ติดต่อ
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ตำแหน่ง
                  </label>
                  <input
                    type="text"
                    name="cus_position"
                    value={formData.cus_position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ที่อยู่
                  </label>
                  <textarea
                    name="cus_address"
                    value={formData.cus_address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="text"
                    name="cus_phone"
                    value={formData.cus_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เลขประจำตัวผู้เสียภาษี
                  </label>
                  <input
                    type="text"
                    name="cus_tax_id"
                    value={formData.cus_tax_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เลขบัญชี
                  </label>
                  <input
                    type="text"
                    name="cus_banknumber"
                    value={formData.cus_banknumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อธนาคาร
                  </label>
                  <input
                    type="text"
                    name="cus_bankname"
                    value={formData.cus_bankname}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">ยืนยันการลบข้อมูล</h3>
              <p className="text-gray-600">
                คุณต้องการลบข้อมูลของ {selectedCustomer?.cus_company_name}{" "}
                ใช่หรือไม่?
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  ลบข้อมูล
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCustomer;
