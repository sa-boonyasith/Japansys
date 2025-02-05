import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit2, Trash2, X ,Plus } from "lucide-react";

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
  const [formData, setFormData] = useState({
    cus_company_name: "",
    contact_name: "",
    cus_address: "",
    cus_phone: "",
    cus_tax_id: "",
  });

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
      setAddModalOpen(false);

      // รีเซ็ตค่าในฟอร์ม
      setFormData({
        cus_company_name: "",
        contact_name: "",
        cus_address: "",
        cus_phone: "",
        cus_tax_id: "",
      });

      // โหลดข้อมูลใหม่
      fetchCustomers();
    } catch (err) {
      console.error("Error adding customer:", err);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/customer/${selectedCustomer.customer_id}`,
        formData
      );
      setIsEditModalOpen(false);
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            รายชื่อลูกค้า
          </h2>
          <div className="flex justify-between">
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
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">
                    ชื่อบริษัท
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">
                    ชื่อผู้ติดต่อ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">
                    เบอร์โทรศัพท์
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 border-b">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {customer.cus_company_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {customer.contact_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {customer.cus_phone}
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
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">แก้ไขข้อมูลลูกค้า</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
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
                    value={formData.cus_company_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cus_company_name: e.target.value,
                      })
                    }
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
                    value={formData.contact_name}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ที่อยู่
                  </label>
                  <textarea
                    value={formData.cus_address}
                    onChange={(e) =>
                      setFormData({ ...formData, cus_address: e.target.value })
                    }
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
                    value={formData.cus_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, cus_phone: e.target.value })
                    }
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
                    value={formData.cus_tax_id}
                    onChange={(e) =>
                      setFormData({ ...formData, cus_tax_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
       {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">เพิ่มลูกค้าใหม่</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="ชื่อบริษัท"
                  value={formData.cus_company_name}
                  onChange={(e) => setFormData({ ...formData, cus_company_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="ชื่อผู้ติดต่อ"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="ที่อยู่"
                  value={formData.cus_address}
                  onChange={(e) => setFormData({ ...formData, cus_address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="เบอร์โทรศัพท์"
                  value={formData.cus_phone}
                  onChange={(e) => setFormData({ ...formData, cus_phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="เลขประจำตัวผู้เสียภาษี"
                  value={formData.cus_tax_id}
                  onChange={(e) => setFormData({ ...formData, cus_tax_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button onClick={() => setAddModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg">
                  ยกเลิก
                </button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg">
                  เพิ่มลูกค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCustomer;
