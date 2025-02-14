import React, { useState, useEffect } from "react";
import { Loader2, Search, X } from "lucide-react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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

    fetchData();
  }, []);

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
  };

  const getMatchingUsers = (employeeId) => {
    return users.filter((user) => user.employee_id === employeeId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">
          Employee Management
        </h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <span>Add Employee</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search Employee ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            onClick={() => handleEmployeeClick(emp)}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  emp.photo
                    ? `http://localhost:8080${emp.photo}`
                    : "/api/placeholder/60/60"
                }
                alt={`${emp.firstname} ${emp.lastname}`}
                className="w-16 h-16 rounded-full"
              />

              <div>
                <h3 className="font-semibold text-lg">
                  {emp.firstname} {emp.lastname}
                </h3>
                <p className="text-gray-600">{emp.job_position}</p>
                <p className="text-gray-500 text-sm">Email: {emp.email}</p>
                <p className="text-gray-500 text-sm">Salary: ${emp.salary}</p>
                <p className="text-gray-500 text-sm">ID: {emp.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Employee Details</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedEmployee.firstname} {selectedEmployee.lastname}
                    </p>
                    <p>
                      <span className="font-medium">Position:</span>{" "}
                      {selectedEmployee.job_position}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedEmployee.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedEmployee.phone_number}
                    </p>
                    <p>
                      <span className="font-medium">Birth Date:</span>{" "}
                      {selectedEmployee.birth_date
                        ? new Date(
                            selectedEmployee.birth_date
                          ).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>

                    <p>
                      <span className="font-medium">Age:</span>{" "}
                      {selectedEmployee.age}
                    </p>
                    <p>
                      <span className="font-medium">Salary:</span> $
                      {selectedEmployee.salary}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Additional Information</h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Liveby:</span>{" "}
                      {selectedEmployee.liveby}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {selectedEmployee.personal_info?.address}
                    </p>
                    <p>
                      <span className="font-medium">City:</span>{" "}
                      {selectedEmployee.personal_info?.city}
                    </p>
                    <p>
                      <span className="font-medium">Zip Code:</span>{" "}
                      {selectedEmployee.personal_info?.zip_code}
                    </p>
                    <p>
                      <span className="font-medium">Ethnicity:</span>{" "}
                      {selectedEmployee.ethnicity}
                    </p>
                    <p>
                      <span className="font-medium">Nationality:</span>{" "}
                      {selectedEmployee.nationality}
                    </p>
                    <p>
                      <span className="font-medium">Religion:</span>{" "}
                      {selectedEmployee.religion}
                    </p>
                    <p>
                      <span className="font-medium">Marital Status:</span>{" "}
                      {selectedEmployee.marital_status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Associated User Accounts */}
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Associated User Accounts</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 text-left border">Username</th>
                        <th className="p-2 text-left border">Email</th>
                        <th className="p-2 text-left border">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getMatchingUsers(selectedEmployee.id).map((user) => (
                        <tr key={user.user_id} className="hover:bg-gray-50">
                          <td className="p-2 border">{user.username}</td>
                          <td className="p-2 border">{user.email}</td>
                          <td className="p-2 border">{user.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
