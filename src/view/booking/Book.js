import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, get, set, push, remove } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import { auth } from "../../Components/firebase/firebase";

const Book = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bookingId, setBookingId] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setUserId(user.uid);
        const db = getDatabase();
        const userRef = ref(db, "users/" + user.uid);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUsername(data.username);
            setEmail(data.email);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // const generateRandomString = () => {
  //   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  //   const digits = '0123456789';
  //   let result = '';
  //   for (let i = 0; i < 4; i++) {
  //     result += digits.charAt(Math.floor(Math.random() * digits.length));
  //   }
  //   for (let i = 0; i < 4; i++) {
  //     result += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return result;
  // };

  const addBookingToDatabase = (bookingId, name, phone, date, time, reason) => {
    const db = getDatabase();
    const bookingRef = push(ref(db, 'users/' + userId + '/bookings'), {
      name: name,
      phone: phone,
      date: date,
      time: time,
      reason: reason,
      bookingId: bookingId,
      paid: false // Add a field to track payment status
    }, function (error) {
      if (error) {
        alert('Error adding booking');
      } else {
        alert('Booking added successfully!');
      }
    });

    // Schedule a check to remove the booking if not paid after 5 minutes
    setTimeout(async () => {
      const snapshot = await get(bookingRef);
      if (snapshot.exists() && !snapshot.val().paid) {
        // If the booking still exists and has not been paid, remove it
        remove(bookingRef);
        navigate('/'); // Navigate to home page
      toast.error('Transaction unsuccessful. You have been redirected to the home page.');
      }
    }, 5 * 60 * 1000);
  };

  

  const handleSubmit = (event) => {
    event.preventDefault();
    const now = new Date();
const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JavaScript
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

const bookingId = 'BK' + day + month + hours + minutes + seconds;
    // const randomString = generateRandomString();
//https://api.vieqr.com/vietqr/MBBank/0000418530364/300000/full.jpg?NDck=thanhtoan%20dbao03122003&FullName=Nguyen%20Cong%20Duy%20Bao&1716262092
    const qrUrl = `https://api.vieqr.com/vietqr/MBBank/0000418530364/300000/full.jpg?NDck=thanhtoan%20${bookingId}&FullName=Nguyen%20Cong%20Duy%20Bao&1716262092`;
    
    console.log(qrUrl); // Log the QR URL to check it
    
    navigate('/qr', { state: { qrUrl, bookingId } });

    // Reset form
    setName('');
    setPhone('');
    setDate('');
    setTime('');
    setReason('');
    addBookingToDatabase(bookingId, name, phone, date, time, reason);

    
  };

  

  return (
    <div className="appointment-form-container">
      <h2>Đăng Ký Hẹn Lịch Khám</h2>
      <img src='https://petpro.com.vn/assets/booking_pet.fcf232f8.png' />
      <form className="appointment-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Tên:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Số điện thoại:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Ngày:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="time">Giờ:</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="reason">Lý do khám:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đăng Ký</button>
      </form>
    </div>
  );
};

export default Book;
