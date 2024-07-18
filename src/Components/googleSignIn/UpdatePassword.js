import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { fetchUserById } from '../../view/account/getUserData';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../../animation/loading-animation';

const BASE_URL = 'http://localhost:5000';

function UpdatePassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = auth.currentUser;
  const navigate = useNavigate()
  const LoadingDots = () => {
    return (
      <div className="loading-dots">
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setLoading(true);
          const userData = await fetchUserById(user.uid);
          const { username } = userData;
          if (username.startsWith("gg")) {
              toast.error("You can't access this site!");
              navigate("/"); 
          } else {
            setEmail(userData.email);
          }
        } catch (error) {
          setError(error.message);
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    });
  
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <LoadingAnimation/>;
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/send-updatePassword-email`, {
        user_email: email
      });
      setLoading(false);
      toast.success("Send email successful!", { autoClose: 2000 });
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error('An error occurred. Please try again.', { autoClose: 2000 });
    }
  };

  return (
    <div className="form-container-reset">
         {loading && <LoadingAnimation />}
      <div className="logo-container">Update Password</div>
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

export default UpdatePassword;
