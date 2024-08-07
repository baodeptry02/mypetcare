import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./view/partials/Home";
import SignIn from "./Components/googleSignIn/signIn";
import Update from "./view/account/Update";
import Admin from "./view/admin/Admin";
import Manager from "./view/manager/Manager";
import Pet from "./view/pet/Pet";
import AddPet from "./view/pet/AddPet";
import PetDetail from "./view/pet/PetDetail";
import Book from "./view/booking/Book";
import AddPetNext from "./view/pet/AddPet-Next"; 
import QrCodePage from "./view/qr/QrCodePage";
import Transaction from "./Components/transaction/TransactionHistory";
import ForgotPassword from "./Components/googleSignIn/ForgotPassword";
import ManageBooking from "./view/booking/ManageBooking";
import BookingDetails from "./view/booking/BookingDetails";
import Header from "./view/partials/Header";
import Footer from "./view/partials/Footer";
import NotFound from "../src/view/invalidPage/404Page"
import Vet from "../src/view/vet/VetDashboard"
import { auth } from "./Components/firebase/firebase";
import "./App.css";
import Rating from "./view/booking/RateBooking"
import StickyContactBar from "./view/partials/StickyContactBar";
import Hotline from "./view/partials/Hotline";
import ResetPassword from "./Components/googleSignIn/ResetPassword";
import UpdatePassword from "./Components/googleSignIn/UpdatePassword";

function MainContent() {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const userRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      userRef.current = currentUser;
    });

    const handleLoading = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };

    handleLoading();

    return () => {
      unsubscribe();
    };
  }, [location.pathname]);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="App">
      {loading && (
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {!loading && (
        <>
          <Header user={userRef.current} currentPath={currentPath} />
          <div className="main-content">
            <Routes>
              <Route path="/signIn" element={<SignIn />} />
              <Route path="/" element={<Home />} />
              <Route path="/account/:userId1" element={<Update  user={userRef.current} />} />
              {/* <Route path="/account" element={<Update user={userRef.current}/>} /> */}
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/vet/*" element={<Vet />} />
              <Route path="/manager/*" element={<Manager />} />
              <Route path="/pet" element={<Pet />} />
              <Route path="/pet/add" element={<AddPet />} />
              <Route path="/pet/add/details" element={<AddPetNext />} />
              <Route path="/pet-details/:petId" element={<PetDetail />} />
              <Route path="/book/*" element={<Book />} />
              <Route path="/manage-booking" element={<ManageBooking />} />
              <Route path="/booking-details/:bookingId" element={<BookingDetails />} />
              <Route path="/rate-booking/:bookingId" element={<Rating />} />
              <Route path="/qr" element={<QrCodePage />} />
              <Route path="/transaction-history" element={<Transaction />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <StickyContactBar currentPath={currentPath} />
          <Hotline currentPath={currentPath} />
          <Footer currentPath={currentPath} />
        </>
      )}
    </div>
  );
}

export default MainContent;
