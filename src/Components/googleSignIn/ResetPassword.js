import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const token = query.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match', { autoClose: 2000 });
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/userData/update-password`, {
        token,
        newPassword: password,
      });
      toast.success("Update password successful!", { autoClose: 2000 });
      navigate('/login');
    } catch (error) {
      toast.error("Token invalid or expired!", { autoClose: 2000 });
    }
  };

  return (
    <div className="form-container-reset">
      <div className="logo-container">Reset Password</div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your new password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your new password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className="form-submit-btn" type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
