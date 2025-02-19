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

  const formatPhoneNumber = (value) => {
    const number = value.replace(/[^\d]/g, "");
    if (number.length <= 3) return number;
    if (number.length <= 6) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  const formatTaxId = (value) => {
    return value.replace(/[^\d]/g, "").slice(0, 13);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cus_phone") {
      const formattedPhone = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedPhone,
      }));
    } else if (name === "cus_tax_id") {
      const formattedTaxId = formatTaxId(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedTaxId,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const FormField = ({ label, name, type = "text", required = true }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow"
          required={required}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow"
          required={required}
        />
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              รายชื่อลูกค้า
            </h2>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="mr-2" size={18} /> เพิ่มลูกค้า
            </button>
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="cus_company_name"
              value={filters.cus_company_name}
              onChange={handleFilterChange}
              placeholder="ค้นหาชื่อบริษัท..."
              className="pl-10 pr-4 py-2 w-full md:w-80 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
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
                      <div className="flex items-center">
                        <Building2 className="mr-2 text-gray-400" size={18} />
                        {customer.cus_company_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {customer.cus_position}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center">
                        <Phone className="mr-2 text-gray-400" size={18} />
                        {customer.cus_phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center">
                        <UserCircle className="mr-2 text-gray-400" size={18} />
                        {customer.contact_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(customer)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                เพิ่มลูกค้าใหม่
              </h3>
              <button
                onClick={closeAddModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6">
              <div className="space-y-4">
                <FormField label="ชื่อบริษัท" name="cus_company_name" />
                <FormField label="ชื่อผู้ติดต่อ" name="contact_name" />
                <FormField label="ตำแหน่ง" name="cus_position" />
                <FormField label="ที่อยู่" name="cus_address" type="textarea" />
                <FormField label="เบอร์โทรศัพท์" name="cus_phone" />
                <FormField label="เลขประจำตัวผู้เสียภาษี" name="cus_tax_id" />
                <FormField label="เลขบัญชี" name="cus_banknumber" />
                <FormField label="ชื่อธนาคาร" name="cus_bankname" />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                แก้ไขข้อมูลลูกค้า
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEdit} className="p-6">
              <div className="space-y-4">
                <FormField label="ชื่อบริษัท" name="cus_company_name" />
                <FormField label="ชื่อผู้ติดต่อ" name="contact_name" />
                <FormField label="ตำแหน่ง" name="cus_position" />
                <FormField label="ที่อยู่" name="cus_address" type="textarea" />
                <FormField label="เบอร์โทรศัพท์" name="cus_phone" />
                <FormField label="เลขประจำตัวผู้เสียภาษี" name="cus_tax_id" />
                <FormField label="เลขบัญชี" name="cus_banknumber" />
                <FormField label="ชื่อธนาคาร" name="cus_bankname" />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                ยืนยันการลบข้อมูล
              </h3>
              <p className="text-gray-600">
                คุณต้องการลบข้อมูลของ{" "}
                <span className="font-medium">
                  {selectedCustomer?.cus_company_name}
                </span>{" "}
                ใช่หรือไม่?
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
