import React, { useState, useEffect } from "react";
import {
  Loader2,
  Search,
  X,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  User,
  Pencil,
  Trash2,
  Briefcase,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 6;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeeRes, userRes] = await Promise.all([
        fetch("http://localhost:8080/api/employee"),
        fetch("http://localhost:8080/api/user"),
      ]);

      if (!employeeRes.ok || !userRes.ok) {
        throw new Error("Server response was not ok");
      }

      const [employeeData, userData] = await Promise.all([
        employeeRes.json(),
        userRes.json(),
      ]);

      setEmployees(employeeData.listemployee);
      setUsers(userData.listuser);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));

      // Upload image immediately when selected
      const formData = new FormData();
      formData.append("photo", file);

      try {
        const response = await fetch(
          `http://localhost:8080/api/employee/${selectedEmployee.id}/photo`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();

        // Update the employee's photo URL in the state
        setSelectedEmployee((prev) => ({
          ...prev,
          photo: data.photo, // Assuming the API returns the new photo path
        }));

        setSuccessMessage("Profile photo updated successfully");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (err) {
        setError("Failed to upload profile photo. Please try again.");
      }
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("photo", selectedImage);

    try {
      const response = await fetch(
        `http://localhost:8080/api/employee/${selectedEmployee.id}/photo`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      setSuccessMessage("Profile photo updated successfully");
      fetchData();
      setSelectedImage(null);
      setImagePreview(null);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError("Failed to upload profile photo. Please try again.");
    }
  };

  const handleEdit = (employee) => {
    setEditForm({
      ...employee,
      birth_date: employee.birth_date
        ? new Date(employee.birth_date).toISOString().split("T")[0]
        : "",
    });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/api/employee/${editForm.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editForm,
            photo: selectedEmployee.photo, // Include the updated photo URL
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      setSuccessMessage("Employee updated successfully");
      await fetchData(); // Refresh the data
      setIsEditing(false);
      setIsModalOpen(false);
      setSelectedImage(null);
      setImagePreview(null);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError("Failed to update employee. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/employee/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      setSuccessMessage("Employee deleted successfully");
      fetchData();
      setShowDeleteConfirm(false);
      setIsModalOpen(false);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError("Failed to delete employee. Please try again.");
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.id?.toString().includes(searchTerm) ||
      emp.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.job_position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    setIsEditing(false);
    setShowDeleteConfirm(false);
  };

  const getMatchingUsers = (employeeId) => {
    return users.filter((user) => user.employee_id === employeeId);
  };

  // const filteredEmployees = employees.filter(
  //   (emp) =>
  //     emp.id?.toString().includes(searchTerm) ||
  //     emp.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     emp.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     emp.job_position?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Pagination controls
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Employee Management
            </h2>
            <p className="text-gray-600">
              Manage and view employee information
            </p>
          </div>
        </div>

        <div className="mb-8 relative">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => handleEmployeeClick(emp)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={
                        emp.photo
                          ? `http://localhost:8080${emp.photo}`
                          : "/api/placeholder/80/80"
                      }
                      alt={`${emp.firstname} ${emp.lastname}`}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                      ID: {emp.id}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {emp.firstname} {emp.lastname}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Building className="w-4 h-4 mr-2" />
                        <span>{emp.job_position}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm">{emp.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>${emp.salary?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

         {/* Pagination Controls */}
         {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {isModalOpen && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {isEditing ? "Edit Employee" : "Employee Details"}
                    </h3>
                    <p className="text-gray-600">
                      {isEditing
                        ? `Editing information for ${selectedEmployee.firstname}`
                        : `Complete information about ${selectedEmployee.firstname}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!isEditing && !showDeleteConfirm && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(selectedEmployee);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsEditing(false);
                        setShowDeleteConfirm(false);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {showDeleteConfirm ? (
                  <div className="p-6 bg-red-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-800 mb-4">
                      Confirm Deletion
                    </h4>
                    <p className="text-red-600 mb-6">
                      Are you sure you want to delete{" "}
                      {selectedEmployee.firstname} {selectedEmployee.lastname}?
                      This action cannot be undone.
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleDelete(selectedEmployee.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <img
                          src={
                            imagePreview ||
                            (selectedEmployee.photo
                              ? `http://localhost:8080${selectedEmployee.photo}`
                              : "/api/placeholder/150/150")
                          }
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                          <Camera className="w-5 h-5" />
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={editForm.firstname || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              firstname: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={editForm.lastname || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              lastname: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          value={editForm.age || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, age: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position
                        </label>
                        <input
                          type="text"
                          value={editForm.job_position || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              job_position: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editForm.email || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={editForm.phone_number || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              phone_number: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          birth_date
                        </label>
                        <input
                          type="date"
                          value={
                            editForm.birth_date
                              ? editForm.birth_date.substring(0, 10)
                              : ""
                          }
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              birth_date: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Salary
                        </label>
                        <input
                          type="number"
                          value={editForm.salary || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              salary: parseFloat(e.target.value),
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          liveby
                        </label>
                        <input
                          type="text"
                          value={editForm.liveby || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              liveby: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={editForm.personal_info?.address || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              personal_info: {
                                ...editForm.personal_info,
                                address: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={editForm.personal_info?.city || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              personal_info: {
                                ...editForm.personal_info,
                                city: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          value={editForm.personal_info?.zip_code || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              personal_info: {
                                ...editForm.personal_info,
                                zip_code: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ethnicity
                        </label>
                        <input
                          type="text"
                          value={editForm.ethnicity || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              ethnicity: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nationality
                        </label>
                        <input
                          type="text"
                          value={editForm.nationality || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              nationality: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Religion
                        </label>
                        <input
                          type="text"
                          value={editForm.religion || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              religion: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Military Status
                        </label>
                        <input
                          type="text"
                          value={editForm.military_status || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              military_status: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marital Status
                        </label>
                        <input
                          type="text"
                          value={editForm.marital_status || ""}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              marital_status: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({});
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 flex justify-center mb-6">
                      <div className="relative">
                        <img
                          src={
                            selectedEmployee.photo
                              ? `http://localhost:8080${selectedEmployee.photo}`
                              : "/api/placeholder/150/150"
                          }
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          Personal Information
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-500">Full Name</p>
                              <p className="font-medium">
                                {selectedEmployee.firstname}{" "}
                                {selectedEmployee.lastname}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-500">Age</p>
                              <p className="font-medium">
                                {selectedEmployee.age}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-500">Position</p>
                              <p className="font-medium">
                                {selectedEmployee.job_position}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">
                                {selectedEmployee.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">
                                {selectedEmployee.phone_number || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Birth Date
                              </p>
                              <p className="font-medium">
                                {selectedEmployee.birth_date
                                  ? new Date(
                                      selectedEmployee.birth_date
                                    ).toLocaleDateString("en-GB")
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-500">Salary</p>
                              <p className="font-medium">
                                ${selectedEmployee.salary?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          Additional Information
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="font-medium">
                                {selectedEmployee.personal_info?.address ||
                                  "N/A"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {selectedEmployee.personal_info?.city}{" "}
                                {selectedEmployee.personal_info?.zip_code}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Liveby</p>
                              <p className="font-medium">
                                {selectedEmployee.liveby}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Ethnicity</p>
                              <p className="font-medium">
                                {selectedEmployee.ethnicity || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Nationality
                              </p>
                              <p className="font-medium">
                                {selectedEmployee.nationality || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Religion</p>
                              <p className="font-medium">
                                {selectedEmployee.religion || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Military status
                              </p>
                              <p className="font-medium">
                                {selectedEmployee.military_status || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Marital Status
                              </p>
                              <p className="font-medium">
                                {selectedEmployee.marital_status || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          Associated User Accounts
                        </h4>
                        <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                  Username
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                  Role
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {getMatchingUsers(selectedEmployee.id).map(
                                (user) => (
                                  <tr
                                    key={user.user_id}
                                    className="border-t border-gray-200"
                                  >
                                    <td className="px-4 py-3">
                                      {user.username}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {user.role}
                                      </span>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
