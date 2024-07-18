import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/send-updatePassword-email`, {
        user_email: email
      });
      toast.success("Send email successful!", { autoClose: 2000 });
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.', { autoClose: 2000 });
    }
  };

  return (
    <div className="form-container-reset">
      <div className="logo-container">Forgot Password</div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="form-submit-btn" type="submit">
          Send Email
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
