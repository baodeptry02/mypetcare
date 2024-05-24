import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "../firebase/firebase"; // Use auth instead of database
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = e.target.email.value;
    sendPasswordResetEmail(auth, emailVal)
      .then(() => {
        alert('Check your email');
        navigate('/');
      })
      .catch((err) => {
        alert(err.message); // Display the actual error message
      });   
  };

  return (
    <div className="forgotPassword">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input className="ipemail" name="email" placeholder="Enter your email" required /><br/>
        <button id="rsPassword">Reset Password</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
