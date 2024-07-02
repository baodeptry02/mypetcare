import axios from "axios";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


const LOCAL_BASE_URL = process.env.REACT_APP_LOCAL_BASE_URL;
const PRODUCTION_BASE_URL = process.env.REACT_APP_PRODUCTION_BASE_URL;
const ENV = process.env.REACT_APP_ENV;

console.log('Environment:', ENV);
console.log('Local Base URL:', LOCAL_BASE_URL);
console.log('Production Base URL:', PRODUCTION_BASE_URL);

const getBaseUrl = () => {
  return ENV === 'production' ? PRODUCTION_BASE_URL : LOCAL_BASE_URL;
};

const BASE_URL = getBaseUrl();

export const googleLogin = async (idToken) => {
  try {
  const response = await axios.post(`${BASE_URL}/auth/google-login`, { idToken });
  return response.data;
} catch (error) {
  throw error.response.data;
}
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const emailLogin = async (email, password) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    console.log("ID Token:", idToken);

    const response = await axios.post(`${BASE_URL}/auth/email-login`, { idToken });
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);

    // Check if the error is related to email verification
    if (error.response && error.response.status === 400 && error.response.data.message.includes('verify your email')) {
      throw new Error('Email not verified');
    }

    throw error;
  }
};