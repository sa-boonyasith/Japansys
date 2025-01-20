import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Carbooking = () => {
  const [carBookings, setCarBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/rentcar'); // URL API
        setCarBookings(response.data.listrentcar || []); // Set to an empty array if no data
        setLoading(false); // Stop loading when data is fetched
      } catch (err) {
        setError('Failed to fetch car booking records');
        console.error(err);
        setLoading(false); // Stop loading even if an error occurs
      }
    };

    fetchCarBookings();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Car Booking Records</h1>
      {carBookings.length === 0 ? (
        <p>No car bookings available.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Reserve Car Name</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Time </th>
              <th className="border border-gray-300 px-4 py-2">Place</th>
              <th className="border border-gray-300 px-4 py-2">Car</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {carBookings.map((booking) => (
              <tr key={booking.rentcar_id}>
                <td className="border border-gray-300 text-center px-4 py-2">{booking.firstname} {booking.lastname}</td>
                <td className="border border-gray-300 text-center px-4 py-2">{new Date(booking.startdate).toLocaleDateString()}-{new Date(booking.enddate).toLocaleDateString()}</td>
                <td className="border border-gray-300 text-center px-4 py-2">{booking.timestart}-{booking.timeend}</td>
                <td className="border border-gray-300 text-center px-4 py-2">{booking.place}</td>
                <td className="border border-gray-300 text-center px-4 py-2">{booking.car}</td>
                <td className="border border-gray-300 text-center px-4 py-2">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Carbooking;
