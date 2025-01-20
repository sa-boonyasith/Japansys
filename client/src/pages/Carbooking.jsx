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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarBooking = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/rentcar");
        if (Array.isArray(res.data.listrentcar)) {
          setCarBooking(res.data.listrentcar);
          setFilteredCarBookings(res.data.listrentcar);
        } else {
          setError("Expected an array of car bookings, but got something else.");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };
    fetchCarBooking();
  }, []);

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    const filtered = carBooking.filter((car) => {
      const searchFilter = currentFilters.search
        ? car.firstname.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          car.lastname.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          car.place.toLowerCase().includes(currentFilters.search.toLowerCase())
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

      const statusFilter = currentFilters.status
        ? car.status === currentFilters.status
        : true;

      return (
        searchFilter &&
        startDateFilter &&
        endDateFilter &&
        startTimeFilter &&
        endTimeFilter &&
        statusFilter
      );
    });

    setFilteredCarBookings(filtered);
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
          <button onClick={resetFilters} className="bg-gray-500 text-white px-4 py-2 rounded">
            Reset
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
          </tr>
        </thead>
        <tbody>
          {filteredCarBookings.map((carbooking) => (
            <tr key={carbooking.rentcar_id}>
              <td className="border text-center border-gray-300 p-2">
                {carbooking.firstname} {carbooking.lastname}
              </td>
              <td className="border text-center border-gray-300 p-2">
                {formatDate(carbooking.startdate)} - {formatDate(carbooking.enddate)}
              </td>
              <td className="border text-center border-gray-300 p-2">
                {carbooking.timestart} - {carbooking.timeend}
              </td>
              <td className="border text-center border-gray-300 p-2">{carbooking.place}</td>
              <td className="border text-center border-gray-300 p-2">{carbooking.car}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Carbooking;
