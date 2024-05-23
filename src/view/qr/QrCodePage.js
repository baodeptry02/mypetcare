import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../../Components/firebase/firebase';
import { TransactionContext } from '../../Components/context/TransactionContext';
import { ToastContainer, toast } from 'react-toastify';
import { ScaleLoader } from "react-spinners"; // Import the spinner you want to use
import { css } from "@emotion/react"; 
import { updateProfile } from "firebase/auth";


const QrCodePage = () => {
  const location = useLocation();
  const { qrUrl, bookingId } = location.state;
  const navigate = useNavigate();
  const { fetchTransactions } = useContext(TransactionContext);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add this line

  const override = css`
    display: block;
    margin: 500px auto;
    border-color: red;
  `;
  

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const db = getDatabase();
        const userRef = ref(db, "users/" + user.uid);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUsername(data.username);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    };

    fetchUserData();
  }, []);
  useEffect(() => {
    const user = auth.currentUser;
    console.log("bookingId:", bookingId);
    console.log("user.uid:", user?.uid); // Sử dụng user?.uid để tránh lỗi nếu user là undefined
  
    if (!username || !bookingId) return;
  
    const intervalId = setInterval(async () => {
      try {
        const { descriptions } = await fetchTransactions(); // Lấy lịch sử giao dịch
        const contentTransfer = `thanhtoan ${bookingId}`;
        console.log('Checking for payment description:', contentTransfer);
        console.log('Transaction descriptions:', descriptions);
        const isPaymentSuccessful = descriptions.some(description => {
          return description.includes(contentTransfer);
        });        
        console.log('isPaymentSuccessful:', isPaymentSuccessful); // Log giá trị của isPaymentSuccessful
  
        if (isPaymentSuccessful) {
          toast.success('Thanh toán thành công! Vui lòng kiểm tra email để xem thông tin cuộc hẹn của bạn');
          clearInterval(intervalId);
          navigate('/');
        } else {
          console.log('Không tìm thấy thanh toán trong lịch sử giao dịch');
        }
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử giao dịch:', error);
      } finally {
        setIsLoading(false);
      }
    }, 10000); // Kiểm tra mỗi 10 giây
  
    // Cập nhật trạng thái thành 'paid' sau 20 giây
    setTimeout(async () => {
      try {
        const user = auth.currentUser;
        console.log('Current user:', user);
        const db = getDatabase();
        const bookingRef = ref(db, `users/${user.uid}/bookings`);
        console.log('Booking ref:', bookingRef);
        const bookingSnapshot = await get(bookingRef);
        console.log("BookingSnapshot:", bookingSnapshot)
        const bookingData = bookingSnapshot.val();
        console.log('Current booking data:', bookingData);
  
        if (bookingSnapshot.exists() && bookingData) {
          await updateProfile(bookingRef, { ...bookingData, paid: true });
        } else {
          console.log('Không tìm thấy dữ liệu đặt chỗ cho bookingId này');
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đặt chỗ:', error);
      }
    }, 20000); // Cập nhật sau 20 giây
  
    return () => clearInterval(intervalId);
  }, [navigate, username, bookingId, fetchTransactions]);
  
  
  

  return (
    <div className="qr-code-page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <h2 style={{paddingBottom: "20px", fontSize: "3rem"}}>Quét QR để thanh toán</h2>
    {isLoading ? (
      <ScaleLoader color={"#123abc"} loading={true} css={override} size={3000} /> // Display the spinner when isLoading is true
    ) : (
      <img style={{ width: "50%" }} src={qrUrl} alt="QR Code" />
    )}
  </div>
  );
};

export default QrCodePage;
