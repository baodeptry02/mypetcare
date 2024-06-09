import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../../Components/context/BookingContext';
import { getDatabase, ref, push, update, get } from "firebase/database";
import { auth } from "../../Components/firebase/firebase";
import { toast, ToastContainer } from 'react-toastify';
import useForceUpdate from '../../hooks/useForceUpdate'

const BookingConfirm = () => {
  const { selectedPet, selectedServices, selectedDateTime } = useContext(BookingContext);
  const [user, setUser] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [username, setUsername] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();
  const forceUpdate = useForceUpdate(); // use the custom hook

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser(currentUser);
          const db = getDatabase();
          const userRef = ref(db, "users/" + currentUser.uid);

          // Fetch user data
          const snapshot = await get(userRef);
          const data = snapshot.val();
          if (data) {
            setUsername(data.username);
            setAccountBalance(data.accountBalance);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (bookingSuccess) {
      navigate('/');
    }
  }, [bookingSuccess, navigate]);

  const calculateTotalPaid = () => {
    return selectedServices.reduce((total, service) => {
      return total + service.price;
    }, 0);
  };

  const generateBookingId = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `BK${day}${month}${hours}${minutes}${seconds}`;
  };

  const addToDatabase = async (newBooking) => {
    const db = getDatabase();
    const bookingRef = ref(db, 'users/' + user.uid + '/bookings');
    try {
      // Add the new booking to the database
      await push(bookingRef, newBooking);
    } catch (error) {
      console.error("Error adding booking to database:", error);
      toast.error("An error occurred while processing your booking. Please try again later.");
    }
  };

  const handleConfirmBooking = async () => {
    const bookingId = generateBookingId();
    const totalPaid = calculateTotalPaid();

    if (user && selectedPet && selectedServices.length > 0 && selectedDateTime) {
      try {
        // Simplify services to just their names
        const serviceNames = selectedServices.map(service => service.name);
        
        const newBooking = {
          bookingId: bookingId,
          pet: selectedPet,
          services: serviceNames,  // Only store the names of the services
          date: selectedDateTime.date,  // Flatten the date and time properties
          time: selectedDateTime.time,
          vet: selectedDateTime.vet,
          totalPaid: totalPaid,
          status: "",
          amountToPay: 0,
        };

        if (accountBalance >= totalPaid) {
          const newBalance = accountBalance - totalPaid;
          const userRef = ref(getDatabase(), "users/" + user.uid);
          await update(userRef, { accountBalance: newBalance });
          newBooking.status = "Paid";
          await addToDatabase(newBooking);

          toast.success("Booking successful! Your account balance has been updated.", {
            autoClose: 2000,
            onClose: () => {
              setBookingSuccess(true);
              forceUpdate(); // force re-render to ensure the toast is displayed
            }
          });
        } else {
          const amountToPay = totalPaid - accountBalance;
          newBooking.status = "Pending Payment";
          newBooking.amountToPay = amountToPay;

          await addToDatabase(newBooking);

          const qrUrl = `https://img.vietqr.io/image/MB-0000418530364-print.png?amount=${amountToPay * 1000}&addInfo=thanhtoan%20${bookingId}&accountName=Nguyen%20Cong%20Duy%20Bao`;

          toast.info("Redirecting to payment page...", {
            autoClose: 2000,
            onClose: () => {
              navigate("/qr", { state: { qrUrl, bookingId } });
              forceUpdate(); // force re-render to ensure the toast is displayed
            },
          });
        }
      } catch (error) {
        console.error("Error confirming booking:", error);
        toast.error("An error occurred while processing your booking. Please try again later.");
      }
    } else {
      toast.error("Incomplete booking details. Please review your selection.");
    }
  };

  // If required data is missing, display a message and prevent booking confirmation
  if (!selectedPet || selectedServices.length === 0 || !selectedDateTime) {
    return (
      <div className="booking-confirm">
        <h1>Booking Confirmation</h1>
        <h2>Please ensure all booking details are selected.</h2>
      </div>
    );
  }

  return (
    <div className="booking-confirm">
      <h1>Booking Confirmation</h1>
      <h2>Pet: {selectedPet ? selectedPet.name : 'N/A'}</h2>
      <h2>Services: {selectedServices.map(service => service.name).join(', ') || 'N/A'}</h2>
      <h2>Date: {selectedDateTime ? selectedDateTime.date : 'N/A'}</h2>
      <h2>Vet: {selectedDateTime ? selectedDateTime.vet : 'N/A'}</h2>
      <h2>Time: {selectedDateTime ? selectedDateTime.time : 'N/A'}</h2>
      <h2>Total Paid: ${calculateTotalPaid()}</h2>
      <button onClick={handleConfirmBooking}>Confirm Booking</button>
      <ToastContainer />
    </div>
  );
};

export default BookingConfirm;
