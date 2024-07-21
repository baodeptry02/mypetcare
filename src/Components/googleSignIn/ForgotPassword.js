import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import axios from 'axios';
import LoadingAnimation from '../../animation/loading-animation';

const BASE_URL = 'http://localhost:5000';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/send-updatePassword-email`, {
        user_email: email
      });
      toast.success("Send email successful!", { autoClose: 2000 });
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.', { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container-reset">
      {loading && <LoadingAnimation />}
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
      <ToastContainer /> {/* Đặt ToastContainer bên ngoài form để tránh việc render lại không cần thiết */}
    </div>
  );
}

export default ForgotPassword;