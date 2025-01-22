import React, { useState, useEffect } from "react";
import axios from "axios";

const Carbooking = () => {
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
    const [newRentcar, setnewRentcar] = useState({
      employee_id: "",
      startdate: "",
      enddate: "",
      timestart: "",
      timeend: "",
      place: "",
      car :"",
    });
    const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarBooking = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/rentcar");
        if (Array.isArray(res.data.listrentcar)) {
          // จัดเรียงข้อมูลโดยคำนวณความใกล้เคียงกับวันที่ปัจจุบัน
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
    const filtered = carBooking.filter((car) => {
      return (
        filterBySearch(car, currentFilters.search) &&
        filterByDate(car, currentFilters.startDate, currentFilters.endDate) &&
        filterByTime(car, currentFilters.startTime, currentFilters.endTime) &&
        filterByExact(car, "status", currentFilters.status)
      );
    });
  
    // Sort by the date closest to today
    const sorted = filtered.sort((a, b) => {
      const today = new Date();
      const diffA = Math.abs(new Date(a.startdate) - today);
      const diffB = Math.abs(new Date(b.startdate) - today);
      return diffA - diffB;
    });
  
    setFilteredCarBookings(sorted);
  };
  
  
  

  const filterBySearch = (car, search) => {
    if (!search) return true;
    const searchText = search.toLowerCase();
    return (
      car.firstname.toLowerCase().includes(searchText) ||
      car.lastname.toLowerCase().includes(searchText) ||
      car.place.toLowerCase().includes(searchText)
    );
  };

  const filterByDate = (car, startDate, endDate) => {
    const carStartDate = new Date(car.startdate);
    const carEndDate = new Date(car.enddate);
    const filterStartDate = startDate ? new Date(startDate) : null;
    const filterEndDate = endDate ? new Date(endDate) : null;

    return (
      (!filterStartDate || carStartDate >= filterStartDate) &&
      (!filterEndDate || carEndDate <= filterEndDate)
    );
  };

  const filterByTime = (car, startTime, endTime) => {
    return (
      (!startTime || car.timestart >= startTime) &&
      (!endTime || car.timeend <= endTime)
    );
  };

  const filterByExact = (car, field, value) => {
    return !value || car[field] === value;
  };

  const resetFilters = () => {
    const initialFilters = {
      search: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      status: "",
    };
    setFilters(initialFilters);
    setFilteredCarBookings(carBooking);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const handleModalChange = (e)=>{
    setnewRentcar({...newRentcar,[e.target.name]:e.target.value})
  }

  const handleAddRentcar = async () => {
    if (
      !newRentcar.employee_id ||
      !newRentcar.startdate ||
      !newRentcar.enddate ||
      !newRentcar.timestart ||
      !newRentcar.timeend ||
      !newRentcar.place || 
      !newRentcar.car 
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const payload = {
        ...newRentcar,
        employee_id: parseInt(newRentcar.employee_id, 10),
      };

      const response = await axios.post("http://localhost:8080/api/rentcar", payload);
      if (response.data && response.data.newrentcar) {
        setCarBooking([...carBooking, response.data.newrentcar]);
        setFilteredCarBookings([...filteredCarBookings, response.data.newrentcar]);
        setShowAddModal(false);
        setnewRentcar({
          employee_id: "",
          startdate: "",
          enddate: "",
          timestart: "",
          timeend: "",
          place:"",
          car:"",
        });
      } else {
        alert("Unexpected response from the server.");
        console.log(error)
      }
    } catch (error) {
      console.error("Failed to add meeting:", error);
      alert("Error adding meeting. Please try again.");
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
            className="border  border-gray-300 p-2 rounded w-full md:w-1/5"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <div className="flex gap-2 w-full md:w-2/5">
            <input
              type="date"
              name="startDate"
              className="border text-gray-400 border-gray-300 p-2 rounded flex-1"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              name="endDate"
              className="border text-gray-400 border-gray-300 p-2 rounded flex-1"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex gap-2 w-full md:w-2/5">
            <input
              type="time"
              name="startTime"
              className="border text-gray-400 border-gray-300 p-2 rounded flex-1"
              value={filters.startTime}
              onChange={handleFilterChange}
            />
            <input
              type="time"
              name="endTime"
              className="border text-gray-400 border-gray-300 p-2 rounded flex-1"
              value={filters.endTime}
              onChange={handleFilterChange}
            />
          </div>
          <select
            name="status"
            className="border text-gray-400 border-gray-300 p-2 rounded w-full md:w-1/5"
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
          onClick={()=> setShowAddModal(true)}
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
          </tr>
        </thead>
        <tbody>
          {filteredCarBookings.map((carbooking) => (
            <tr key={carbooking.rentcar_id}>
              <td className="border text-center border-gray-300 p-2">
                {carbooking.firstname} {carbooking.lastname}
              </td>
              <td className="border text-center border-gray-300 p-2">
                {formatDate(carbooking.startdate)} -{" "}
                {formatDate(carbooking.enddate)}
              </td>
              <td
                className="border text-center border-gray-300 p-2"
              >
                {carbooking.timestart} - {carbooking.timeend}
              </td>
              <td className="border text-center border-gray-300 p-2">
                {carbooking.place}
              </td>
              <td className="border text-center border-gray-300 p-2">
                {carbooking.car}
              </td>
              <td className="border text-center border-gray-300 p-2">
                {carbooking.status}
              </td>
            </tr>
          ))}
          {filteredCarBookings.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 p-4">
                No bookings found matching the filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Add Rentcar</h2>
            <input
              type="text"
              name="employee_id"
              placeholder="Employee ID"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newRentcar.employee_id}
              onChange={handleModalChange}
            />
            <input
              type="date"
              name="startdate"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newRentcar.startdate}
              onChange={handleModalChange}
            />
            <input
              type="date"
              name="enddate"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newRentcar.enddate}
              onChange={handleModalChange}
            />
            <input
              type="time"
              name="timestart"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newRentcar.timestart}
              onChange={handleModalChange}
            />
            <input
              type="time"
              name="timeend"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newRentcar.timeend}
              onChange={handleModalChange}
            />
            <input
              type="text"
              name="place"
              placeholder="Place"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newRentcar.place}
              onChange={handleModalChange}
            />
            <input
              type="text"
              name="car"
              placeholder="Car"
              className="border border-gray-300 p-2 rounded w-full mb-2"
              value={newRentcar.car}
              onChange={handleModalChange}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRentcar}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carbooking;