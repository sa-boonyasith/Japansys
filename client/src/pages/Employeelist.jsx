import React, { useState, useEffect } from "react";

const Employeelist = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
    photo: ""
  });

  // Existing fetch and handler functions remain the same...
  const fetchEmployee = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/employee");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSalaryData(data.listemployee || []);
      setFilteredItems(data.listemployee || []);
    } catch (err) {
      setError("Failed to fetch salary data.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' || name === 'age' ? parseFloat(value) || value : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await fetch(`http://localhost:8080/api/employee/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to update employee');
      } else {
        const response = await fetch('http://localhost:8080/api/employee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to add employee');
      }
      fetchEmployee();
      setShowForm(false);
      setShowDetailModal(false);
      setEditingId(null);
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
        photo: ""
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShowDetail = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleEdit = () => {
    setFormData({
      ...selectedEmployee,
      birth_date: selectedEmployee.birth_date.split('T')[0] // Format date for input field
    });
    setEditingId(selectedEmployee.id);
    setShowForm(true);
    setShowDetailModal(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/employee/${selectedEmployee.id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete employee');
        fetchEmployee();
        setShowDetailModal(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Existing list view code remains the same... */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employee List</h2>
        <button 
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
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
              photo: ""
            });
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Employee
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="bg-white rounded-lg shadow">
        {filteredItems.map((employee) => (
          <div 
            key={employee.id} 
            onClick={() => handleShowDetail(employee)}
            className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium text-lg">{employee.firstname} {employee.lastname}</h3>
              <p className="text-gray-600">{employee.job_position}</p>
            </div>
            <div className="text-gray-500">
              ฿{employee.salary ? employee.salary.toLocaleString('th-TH', {minimumFractionDigits: 2}) : "N/A"}
            </div>
          </div>
        ))}
      </div>

      {/* Updated Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold">Employee Details</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold border-b pb-2">Personal Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedEmployee.firstname} {selectedEmployee.lastname}</p>
                  <p><span className="font-medium">Email:</span> {selectedEmployee.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedEmployee.phone_number}</p>
                  <p><span className="font-medium">Birth Date:</span> {new Date(selectedEmployee.birth_date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Age:</span> {selectedEmployee.age}</p>
                  <p><span className="font-medium">Address:</span> {selectedEmployee.liveby}</p>
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold border-b pb-2">Employment Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Position:</span> {selectedEmployee.job_position}</p>
                  <p><span className="font-medium">Salary:</span> ฿{selectedEmployee.salary?.toLocaleString('th-TH', {minimumFractionDigits: 2})}</p>
                  <p><span className="font-medium">Role:</span> {selectedEmployee.role}</p>
                </div>
              </div>

              {/* Background Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold border-b pb-2">Background Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Nationality:</span> {selectedEmployee.nationality}</p>
                  <p><span className="font-medium">Ethnicity:</span> {selectedEmployee.ethnicity}</p>
                  <p><span className="font-medium">Religion:</span> {selectedEmployee.religion}</p>
                  <p><span className="font-medium">Marital Status:</span> {selectedEmployee.marital_status}</p>
                  <p><span className="font-medium">Military Status:</span> {selectedEmployee.military_status}</p>
                </div>
              </div>

              {/* Banking Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold border-b pb-2">Banking Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Bank:</span> {selectedEmployee.banking || 'N/A'}</p>
                  <p><span className="font-medium">Account Number:</span> {selectedEmployee.banking_id || 'N/A'}</p>
                </div>
              </div>

              {/* System Information */}
              <div className="space-y-4 col-span-2">
                <h4 className="text-lg font-semibold border-b pb-2">System Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Created:</span> {new Date(selectedEmployee.created_at).toLocaleString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(selectedEmployee.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal code remains the same... */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? 'Edit Employee' : 'Add New Employee'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Firstname:</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Lastname:</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Job Position:</label>
                  <input
                    type="text"
                    name="job_position"
                    value={formData.job_position}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Salary:</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Birth Date:</label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Ethnicity:</label>
                  <input
                    type="text"
                    name="ethnicity"
                    value={formData.ethnicity}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Nationality:</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Religion:</label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Marital Status:</label>
                  <input
                    type="text"
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Military Status:</label>
                  <input
                    type="text"
                    name="military_status"
                    value={formData.military_status}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Address:</label>
                  <input
                    type="text"
                    name="liveby"
                    value={formData.liveby}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Bank Name:</label>
                  <input
                    type="text"
                    name="banking"
                    value={formData.banking}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Bank Account Number:</label>
                  <input
                    type="text"
                    name="banking_id"
                    value={formData.banking_id}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {editingId ? 'Update' : 'Save'}
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