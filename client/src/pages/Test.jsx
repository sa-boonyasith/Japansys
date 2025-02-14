import React, { useState, useEffect } from "react";
import { Camera, Search, Plus, Pencil, Trash2, X } from "lucide-react";

const Employeelist = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    job_position: "",
    salary: "",
    email: "",
    phone_number: "",
    birth_date: "",
    age: "",
    ethnicity: "",
    nationality: "",
    religion: "",
    marital_status: "",
    military_status: "",
    liveby: "",
    banking: "",
    banking_id: "",
    photo: "",
    personal_info: {
      address: "",
      city: "",
      zip_code: "",
    },
  });

  const fetchEmployee = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/employee");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSalaryData(data.listemployee || []);
      setFilteredItems(data.listemployee || []);
    } catch (err) {
      setError("Failed to fetch employee data.");
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    const filtered = salaryData.filter(
      (employee) =>
        employee.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.job_position?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, salaryData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "salary" || name === "age"
          ? parseFloat(value) || value
          : value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.keys(formData).forEach((key) => {
        if (key !== "photo" && key !== "personal_info") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append photo if exists
      if (photoFile) {
        formDataToSend.append("photo", photoFile);
      }

      // Add personal info
      formDataToSend.append(
        "personal_info",
        JSON.stringify(formData.personal_info)
      );

      const url = editingId
        ? `http://localhost:8080/api/employee/${editingId}`
        : "http://localhost:8080/api/employee";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        body: formDataToSend,
      });

      if (!response.ok)
        throw new Error(`Failed to ${editingId ? "update" : "add"} employee`);

      fetchEmployee();
      setShowForm(false);
      setShowDetailModal(false);
      setEditingId(null);
      setPhotoFile(null);
      setPhotoPreview(null);
      setFormData({
        firstname: "",
        lastname: "",
        job_position: "",
        salary: "",
        email: "",
        phone_number: "",
        birth_date: "",
        age: "",
        ethnicity: "",
        nationality: "",
        religion: "",
        marital_status: "",
        military_status: "",
        liveby: "",
        banking: "",
        banking_id: "",
        photo: "",
        personal_info: {
          address: "",
          city: "",
          zip_code: "",
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShowDetail = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleEdit = (employee) => {
    setFormData({
      ...employee,
      birth_date: employee.birth_date.split("T")[0],
    });
    setEditingId(employee.id);
    setPhotoPreview(
      employee.photo ? `http://localhost:8080${employee.photo}` : null
    );
    setShowForm(true);
    setShowDetailModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/employee/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Failed to delete employee");
        fetchEmployee();
        setShowDetailModal(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Employee Management
            </h1>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setPhotoFile(null);
                setPhotoPreview(null);
                setFormData({
                  firstname: "",
                  lastname: "",
                  job_position: "",
                  salary: "",
                  email: "",
                  phone_number: "",
                  birth_date: "",
                  age: "",
                  ethnicity: "",
                  nationality: "",
                  religion: "",
                  marital_status: "",
                  military_status: "",
                  liveby: "",
                  banking: "",
                  banking_id: "",
                  photo: "",
                  personal_info: {
                    address: "",
                    city: "",
                    zip_code: "",
                  },
                });
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Add Employee
            </button>
          </div>

          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 shadow-sm hover:shadow-md"
            />
            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={20}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((employee) => (
              <div
                key={employee.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleShowDetail(employee)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={
                        employee.photo
                          ? `http://localhost:8080${employee.photo}`
                          : "/api/placeholder/64/64"
                      }
                      alt={`${employee.firstname} ${employee.lastname}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {employee.firstname} {employee.lastname}
                    </h3>
                    <p className="text-gray-600">{employee.job_position}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {employee.email}
                  </p>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Salary:</span> ฿
                    {employee.salary?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      selectedEmployee.photo
                        ? `http://localhost:8080${selectedEmployee.photo}`
                        : "/api/placeholder/96/96"
                    }
                    alt={`${selectedEmployee.firstname} ${selectedEmployee.lastname}`}
                    className="w-20 h-20 rounded-xl object-cover shadow-md"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedEmployee.firstname} {selectedEmployee.lastname}
                    </h2>
                    <p className="text-gray-600 text-lg">
                      {selectedEmployee.job_position}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(selectedEmployee)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors shadow-md"
                  >
                    <Pencil size={18} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedEmployee.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-md"
                  >
                    <X size={18} />
                    Close
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <p className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">
                          {selectedEmployee.email}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">
                          {selectedEmployee.phone_number}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Birth Date:</span>
                        <span className="font-medium">
                          {new Date(
                            selectedEmployee.birth_date
                          ).toLocaleDateString()}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">
                          {selectedEmployee.age}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium">
                          {selectedEmployee.liveby}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Employment Information
                    </h3>
                    <div className="space-y-3">
                      <p className="flex justify-between">
                        <span className="text-gray-600">Position:</span>
                        <span className="font-medium">
                          {selectedEmployee.job_position}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Salary:</span>
                        <span className="font-medium">
                          ฿{selectedEmployee.salary?.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Background Information
                    </h3>
                    <div className="space-y-3">
                      <p className="flex justify-between">
                        <span className="text-gray-600">Nationality:</span>
                        <span className="font-medium">
                          {selectedEmployee.nationality}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Ethnicity:</span>
                        <span className="font-medium">
                          {selectedEmployee.ethnicity}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Religion:</span>
                        <span className="font-medium">
                          {selectedEmployee.religion}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Marital Status:</span>
                        <span className="font-medium">
                          {selectedEmployee.marital_status}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Military Status:</span>
                        <span className="font-medium">
                          {selectedEmployee.military_status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Banking Information
                    </h3>
                    <div className="space-y-3">
                      <p className="flex justify-between">
                        <span className="text-gray-600">Bank:</span>
                        <span className="font-medium">
                          {selectedEmployee.banking || "N/A"}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-medium">
                          {selectedEmployee.banking_id || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  System Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p className="text-gray-600">
                    Created:{" "}
                    {new Date(selectedEmployee.created_at).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    Last Updated:{" "}
                    {new Date(selectedEmployee.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? "Edit Employee" : "Add New Employee"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setPhotoPreview(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <img
                    src={photoPreview || "/api/placeholder/128/128"}
                    alt="Employee photo"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                    <Camera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Firstname
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Position
                    </label>
                    <input
                      type="text"
                      name="job_position"
                      value={formData.job_position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ethnicity
                    </label>
                    <input
                      type="text"
                      name="ethnicity"
                      value={formData.ethnicity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Religion
                    </label>
                    <input
                      type="text"
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lastname
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="liveby"
                      value={formData.liveby}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="banking"
                      value={formData.banking}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      name="banking_id"
                      value={formData.banking_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setPhotoPreview(null);
                  }}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employeelist;
