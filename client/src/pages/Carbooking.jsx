import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const CarBooking = () => {
  const [carBooking, setCarBooking] = useState([]);
  const [filteredCarBookings, setFilteredCarBookings] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    status: "",
  });
  const [newRentCar, setNewRentCar] = useState({
    employee_id: "",
    startdate: "",
    enddate: "",
    timestart: "",
    timeend: "",
    place: "",
    car: "",
    status: "pending",
  });
  const [editRentCar, setEditRentCar] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // แปลง JSON เป็น Object
    }
  }, []);

  useEffect(() => {
    const fetchCarBooking = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/rentcar");
        if (Array.isArray(res.data.listrentcar)) {
          const today = new Date();
          const sortedCarBookings = res.data.listrentcar.sort((a, b) => {
            const diffA = Math.abs(new Date(a.startdate) - today);
            const diffB = Math.abs(new Date(b.startdate) - today);
            return diffA - diffB;
          });
          setCarBooking(sortedCarBookings);
          setFilteredCarBookings(sortedCarBookings);
        } else {
          setError(
            "Expected an array of car bookings, but got something else."
          );
        }
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCarBooking();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    let filtered = carBooking.filter((car) => {
      const searchFilter = currentFilters.search
        ? car.firstname
            ?.toLowerCase()
            .includes(currentFilters.search.toLowerCase()) ||
          car.lastname
            ?.toLowerCase()
            .includes(currentFilters.search.toLowerCase())
        : true;
      const statusFilter = currentFilters.status
        ? car.status === currentFilters.status
        : true;
      const startDateFilter = currentFilters.startDate
        ? new Date(car.startdate) >= new Date(currentFilters.startDate)
        : true;
      const endDateFilter = currentFilters.endDate
        ? new Date(car.enddate) <= new Date(currentFilters.endDate)
        : true;
      const startTimeFilter = currentFilters.startTime
        ? car.timestart >= currentFilters.startTime
        : true;
      const endTimeFilter = currentFilters.endTime
        ? car.timeend <= currentFilters.endTime
        : true;

      return (
        searchFilter &&
        statusFilter &&
        startDateFilter &&
        endDateFilter &&
        startTimeFilter &&
        endTimeFilter
      );
    });

    filtered = filtered.sort((a, b) => {
      const today = new Date();
      const diffA = Math.abs(new Date(a.startdate) - today);
      const diffB = Math.abs(new Date(b.startdate) - today);
      return diffA - diffB;
    });

    setFilteredCarBookings(filtered);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      status: "",
    });
    setFilteredCarBookings(carBooking);
  };

  const handleModalChange = (e) => {
    setNewRentCar({ ...newRentCar, [e.target.name]: e.target.value });
  };

  const handleEditModalChange = (e) => {
    setEditRentCar({ ...editRentCar, [e.target.name]: e.target.value });
  };

  const formatInputDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleAddRentCar = async () => {
    if (Object.values(newRentCar).some((value) => !value)) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const payload = {
        ...newRentCar,
        employee_id: parseInt(newRentCar.employee_id, 10),
      };

      const response = await axios.post(
        "http://localhost:8080/api/rentcar",
        payload
      );
      if (response.data && response.data.newrentcar) {
        setCarBooking([...carBooking, response.data.newrentcar]);
        setFilteredCarBookings([
          ...filteredCarBookings,
          response.data.newrentcar,
        ]);
        setShowAddModal(false);
        setNewRentCar({
          employee_id: "",
          startdate: "",
          enddate: "",
          timestart: "",
          timeend: "",
          place: "",
          car: "",
          status: "pending",
        });
      } else {
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Failed to add car booking:", error);
      alert("Error adding car booking. Please try again.");
    }
  };

  const handleEditRentCar = async () => {
    if (!editRentCar) return;

    try {
      const payload = {
        ...editRentCar,
        employee_id: parseInt(editRentCar.employee_id, 10),
      };

      const response = await axios.put(
        `http://localhost:8080/api/rentcar/${editRentCar.rentcar_id}`,
        payload
      );

      if (response.status === 201 && response.data.update) {
        const updatedBookings = carBooking.map((car) =>
          car.rentcar_id === editRentCar.rentcar_id
            ? { ...car, ...response.data.update }
            : car
        );
        setCarBooking(updatedBookings);
        setFilteredCarBookings(updatedBookings);
        setShowEditModal(false);
        setEditRentCar(null);
      } else {
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Failed to edit car booking:", error);
      alert("Error editing car booking. Please try again.");
    }
  };

  const initiateDelete = (carId) => {
    setDeleteItemId(carId);
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/rentcar/${deleteItemId}`
      );

      if (response.data && response.data.delete) {
        const updatedBookings = carBooking.filter(
          (car) => car.rentcar_id !== deleteItemId
        );
        setCarBooking(updatedBookings);
        setFilteredCarBookings(updatedBookings);
        setShowConfirmDialog(false);
        setDeleteItemId(null);
      } else {
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Failed to delete car booking:", error);
      alert("Error deleting car booking. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "allowed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg shadow">
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8"></div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 bottom-[6px] text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="search"
                placeholder="Search by name or place..."
                className="pl-10 w-full  rounded-lg border h-8 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="date"
                  name="startDate"
                  className="pl-5 w-full rounded-lg border h-8 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="date"
                  name="endDate"
                  className="pl-10 w-full rounded-lg border h-8 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="time"
                  name="startTime"
                  className="pl-10 w-full rounded-lg border h-8 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  value={filters.startTime}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="time"
                  name="endTime"
                  className="pl-10 w-full rounded-lg border h-8 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  value={filters.endTime}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <select
              name="status"
              className="rounded-lg border-gray-200 border h-8 focus:border-blue-500 focus:ring-blue-500"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="allowed">Allowed</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200"
              >
                Reset
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Booking
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Name
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Date & Time
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Location
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Vehicle
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  {user?.role === "admin" && (
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCarBookings.map((car) => (
                  <tr key={car.rentcar_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {car.firstname} {car.lastname}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {car.employee_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(car.startdate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {car.timestart} - {car.timeend}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {car.place}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Car className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{car.car}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          car.status
                        )}`}
                      >
                        {car.status}
                      </span>
                    </td>
                    {user?.role === "admin" && (
                      <td className="">
                        <div className="gap-2 px-6">
                          <button
                            onClick={() => {
                              setEditRentCar(car);
                              setShowEditModal(true);
                            }}
                            className="p-1 text-blue-500 hover:text-blue-800 transition-colors duration-200"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => initiateDelete(car.rentcar_id)}
                            className="p-1 text-red-500 hover:text-red-800 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Booking Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-md max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Add New Booking</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="number"
                    name="employee_id"
                    value={newRentCar.employee_id}
                    onChange={handleModalChange}
                    className="w-full rounded-lg border border-gray-200"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startdate"
                      value={newRentCar.startdate}
                      onChange={handleModalChange}
                      className="w-full rounded-lg border border-gray-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="enddate"
                      value={newRentCar.enddate}
                      onChange={handleModalChange}
                      className="w-full rounded-lg border border-gray-200"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="timestart"
                      value={newRentCar.timestart}
                      onChange={handleModalChange}
                      className="w-full rounded-lg border border-gray-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="timeend"
                      value={newRentCar.timeend}
                      onChange={handleModalChange}
                      className="w-full rounded-lg border border-gray-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={newRentCar.place}
                    onChange={handleModalChange}
                    className="w-full rounded-lg border border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle
                  </label>
                  <input
                    type="text"
                    name="car"
                    value={newRentCar.car}
                    onChange={handleModalChange}
                    className="w-full rounded-lg border border-gray-200"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRentCar}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Add Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Booking Modal */}
        {showEditModal && editRentCar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="number"
                    name="employee_id"
                    value={editRentCar.employee_id}
                    onChange={handleEditModalChange}
                    className="w-full rounded-lg border border-gray-200"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startdate"
                      value={formatInputDate(editRentCar.startdate)}
                      onChange={handleEditModalChange}
                      className="w-full rounded-lg border border-gray-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm  font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="enddate"
                      value={formatInputDate(editRentCar.enddate)}
                      onChange={handleEditModalChange}
                      className="w-full rounded-lg border border-gray-200"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="timestart"
                      value={editRentCar.timestart}
                      onChange={handleEditModalChange}
                      className="w-full rounded-lg border border-gray-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="timeend"
                      value={editRentCar.timeend}
                      onChange={handleEditModalChange}
                      className="w-full rounded-lg border border-gray-200"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={editRentCar.place}
                    onChange={handleEditModalChange}
                    className="w-full rounded-lg border border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle
                  </label>
                  <input
                    type="text"
                    name="car"
                    value={editRentCar.car}
                    onChange={handleEditModalChange}
                    className="w-full rounded-lg border border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editRentCar.status}
                    onChange={handleEditModalChange}
                    className="w-full rounded-lg border border-gray-200"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="allowed">Allowed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditRentCar(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditRentCar}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-bold">Confirm Delete</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this booking? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setDeleteItemId(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarBooking;
