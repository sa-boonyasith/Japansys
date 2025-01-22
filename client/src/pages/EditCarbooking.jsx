import React, { useState, useEffect } from "react";
import axios from "axios";

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
    status:"pending"
  });
  const [editRentCar, setEditRentCar] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setError("Expected an array of car bookings, but got something else.");
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
    const filtered = carBooking.filter((car) => {
      const searchFilter = currentFilters.search
        ? car.firstname.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          car.lastname.toLowerCase().includes(currentFilters.search.toLowerCase())
        : true;
      const statusFilter = currentFilters.status ? car.status === currentFilters.status : true;
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

    const sorted = filtered.sort((a, b) => {
      const today = new Date();
      const diffA = Math.abs(new Date(a.startdate) - today);
      const diffB = Math.abs(new Date(b.startdate) - today);
      return diffA - diffB;
    });

    setFilteredCarBookings(sorted);
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

      const response = await axios.post("http://localhost:8080/api/rentcar", payload);
      if (response.data && response.data.newrentcar) {
        setCarBooking([...carBooking, response.data.newrentcar]);
        setFilteredCarBookings([...filteredCarBookings, response.data.newrentcar]);
        setShowAddModal(false);
        setNewRentCar({
          employee_id: "",
          startdate: "",
          enddate: "",
          timestart: "",
          timeend: "",
          place: "",
          car: "",
          status:"",
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
    if (!editRentCar) {
      alert("Please select a car booking to edit.");
      return;
    }
  
    try {
      const payload = {
        ...editRentCar,
        employee_id: parseInt(editRentCar.employee_id, 10), // Ensure employee_id is an integer
      };
  
      const response = await axios.put(
        `http://localhost:8080/api/rentcar/${editRentCar.rentcar_id}`,
        payload
      );
  
      if (response.status === 201 && response.data.update) {
        const updatedCarBooking = carBooking.map((car) =>
          car.rentcar_id === editRentCar.rentcar_id
            ? { ...car, ...response.data.update }
            : car
        );
        setCarBooking(updatedCarBooking);
        setFilteredCarBookings(updatedCarBooking);
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
  

  const handleDeleteRentCar = async (carId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/rentcar/${carId}`);

        if (response.data && response.data.delete) {
          const updatedCarBooking = carBooking.filter(
            (car) => car.rentcar_id !== carId
          );
          setCarBooking(updatedCarBooking);
          setFilteredCarBookings(updatedCarBooking);
        } else {
          alert("Unexpected response from the server.");
        }
      } catch (error) {
        console.error("Failed to delete car booking:", error);
        alert("Error deleting car booking. Please try again.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search for Name or Place"
            className="border border-gray-300 p-2 rounded w-full md:w-1/5"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <div className="flex gap-2 w-full md:w-2/5">
            <input
              type="date"
              name="startDate"
              className="border border-gray-300 p-2 rounded flex-1"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="endDate"
              className="border border-gray-300 p-2 rounded flex-1"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex gap-2 w-full md:w-2/5">
            <input
              type="time"
              name="startTime"
              className="border border-gray-300 p-2 rounded flex-1"
              value={filters.startTime}
              onChange={handleFilterChange}
            />
            <input
              type="time"
              name="endTime"
              className="border border-gray-300 p-2 rounded flex-1"
              value={filters.endTime}
              onChange={handleFilterChange}
            />
          </div>
          <select
            name="status"
            className="border border-gray-300 p-2 rounded w-full md:w-1/5"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="allowed">Allowed</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Booking
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Time</th>
            <th className="border border-gray-300 p-2">Place</th>
            <th className="border border-gray-300 p-2">Car</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCarBookings.map((car) => (
            <tr key={car.rentcar_id} className="text-center">
              <td className="border border-gray-300 p-2">
                {car.firstname} {car.lastname}
              </td>
              <td className="border border-gray-300 p-2">
                {new Date(car.startdate).toLocaleDateString()} -{" "}
                {new Date(car.enddate).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 p-2">
                {car.timestart} - {car.timeend}
              </td>
              <td className="border border-gray-300 p-2">{car.place}</td>
              <td className="border border-gray-300 p-2">{car.car}</td>
              <td className="border border-gray-300 p-2 capitalize">
                {car.status}
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => {
                    setEditRentCar(car);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteRentCar(car.rentcar_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filteredCarBookings.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                No car bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-4/5 md:w-1/3">
            <h2 className="text-xl mb-4">Add New Booking</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="employee_id"
                placeholder="Employee ID"
                className="border border-gray-300 p-2 rounded"
                value={newRentCar.employee_id}
                onChange={handleModalChange}
              />
              <input
                type="date"
                name="startdate"
                placeholder="Start Date"
                className="border border-gray-300 p-2 rounded"
                value={newRentCar.startdate}
                onChange={handleModalChange}
              />
              <input
                type="date"
                name="enddate"
                placeholder="End Date"
                className="border border-gray-300 p-2 rounded"
                value={newRentCar.enddate}
                onChange={handleModalChange}
              />
              <input
                type="time"
                name="timestart"
                placeholder="Start Time"
                className="border border-gray-300 p-2 rounded"
                value={newRentCar.timestart}
                onChange={handleModalChange}
              />
              <input
                type="time"
                name="timeend"
                placeholder="End Time"
                className="border border-gray-300 p-2 rounded"
                value={newRentCar.timeend}
                onChange={handleModalChange}
              />
              <input
                type="text"
                name="place"
                placeholder="Place"
                className="border border-gray-300 p-2 rounded"
                value={newRentCar.place}
                onChange={handleModalChange}
              />
              <input
                type="text"
                name="car"
                placeholder="Car"
                className="border border-gray-300 p-2 rounded"
                value={newRentCar.car}
                onChange={handleModalChange}
              />
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleAddRentCar}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showEditModal && editRentCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-4/5 md:w-1/3">
            <h2 className="text-xl mb-4">Edit Booking</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="employee_id"
                placeholder="Employee ID"
                className="border border-gray-300 p-2 rounded"
                value={editRentCar.employee_id}
                onChange={handleEditModalChange}
              />
              <input
                type="date"
                name="startdate"
                className="border border-gray-300 p-2 rounded"
                value={formatInputDate(editRentCar.startdate)}
                onChange={handleEditModalChange}
              />
              <input
                type="date"
                name="enddate"
                className="border border-gray-300 p-2 rounded"
                value={formatInputDate(editRentCar.enddate)}
                onChange={handleEditModalChange}
              />
              <input
                type="time"
                name="timestart"
                className="border border-gray-300 p-2 rounded"
                value={editRentCar.timestart}
                onChange={handleEditModalChange}
              />
              <input
                type="time"
                name="timeend"
                className="border border-gray-300 p-2 rounded"
                value={editRentCar.timeend}
                onChange={handleEditModalChange}
              />
              <input
                type="text"
                name="place"
                className="border border-gray-300 p-2 rounded"
                value={editRentCar.place}
                onChange={handleEditModalChange}
              />
              <input
                type="text"
                name="car"
                className="border border-gray-300 p-2 rounded"
                value={editRentCar.car}
                onChange={handleEditModalChange}
              />
              <select
            name="status"
            className="border border-gray-300 p-2 rounded"
            value={editRentCar.status}
            onChange={handleEditModalChange}
          >
            <option value="pending">Pending</option>
            <option value="allowed">Allowed</option>
            <option value="rejected">Rejected</option>
          </select>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleEditRentCar}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarBooking;
