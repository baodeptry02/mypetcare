import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../Components/firebase/firebase";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log('No user is currently logged in.');
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const db = getDatabase();
        const bookingRef = ref(db, `users/${user.uid}/bookings/${bookingId}`);
        const snapshot = await get(bookingRef);
        if (snapshot.exists()) {
          setBooking(snapshot.val());
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBookingDetails();
  }, [user, bookingId]);

  if (!booking) {
    return <p>Loading booking details...</p>;
  }

  return (
    <div className="booking-details-page">
      <h2>Booking Details</h2>
      <table className="booking-details-table">
        <tbody>
          {Object.entries(booking).map(([key, value]) => (
            <tr key={key}>
              <td className="key-column">{key}</td>
              <td className="value-column">{value.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default BookingDetails;
