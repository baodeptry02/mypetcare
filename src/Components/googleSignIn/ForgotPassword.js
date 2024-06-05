import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "../firebase/firebase"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
    const navigate = useNavigate();

    const signUp = () => {
      navigate("/signIn")
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = e.target.email.value;
    sendPasswordResetEmail(auth, emailVal)
      .then(() => {
        toast.success('Check your email');
        navigate('/');
      })
      .catch((err) => {
        toast.error(err.message); 
      });   
  };

  return (
    <div class="form-container-reset">
      <div class="logo-container">
        Forgot Password
      </div>

      <form class="form" onSubmit={handleSubmit}>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" id="email" name="email" placeholder="Enter your email" required=""/>
        </div>

        <button class="form-submit-btn" type="submit">Send Email</button>
      </form>

      <p class="signup-link">
        Don't have an account?
        <a onClick={signUp} class="signup-link link"> Sign up now</a>
      </p>
    </div>
  );
}

export default ForgotPassword;
