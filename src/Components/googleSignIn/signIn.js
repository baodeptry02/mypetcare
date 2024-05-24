import React, { useState, useEffect } from "react";
import { auth, provider } from "../firebase/firebase"; // Assuming config file with Firebase settings
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import Home from "../../view/partials/Home";
import { useNavigate } from "react-router-dom";
import { fetchSignInMethodsForEmail, updateProfile } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDatabase, ref, set, onValue, get } from "firebase/database";

function SignIn() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState(null); // Track logged-in user email
  const [error, setError] = useState(null); // Store error messages
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  function addDataBase(userId, email, name, role) {
    const db = getDatabase();
    set(
      ref(db, "users/" + userId),
      {
        email: email,
        username: name,
        role: role,
      },
      function (error) {
        if (error) {
          alert("Lỗi");
        } else {
          alert("Thành Công !!!");
        }
      }
    );
  }

  const handleGoogleLogin = async () => {
<<<<<<< HEAD
  
    try {
      const data = await signInWithPopup(auth, provider);
      const userEmail = data.user.email;
      const userNamePart = userEmail.split('@')[0];
      const userName = 'gg' + userNamePart;
      const userId = data.user.uid;
      const db = getDatabase();
      const userRef = ref(db, 'users/' + userId);
      let userRole = 'user';
  
      // Kiểm tra và lấy dữ liệu người dùng từ Firebase
      const userDataSnapshot = await new Promise((resolve) => {
=======
    try {
      const data = await signInWithPopup(auth, provider); // Replace 'provider' with your Google Sign-in provider
      console.log(data);
      const userEmail = data.user.email;
      const userNamePart = userEmail.split("@")[0]; // Lấy phần trước @ của email
      const userName = "gg" + userNamePart; // Tạo username mới với tiền tố "gg"
      const userId = data.user.uid;
      setUsername(userName);
      setUserEmail(userEmail);
      localStorage.setItem("email", userEmail); // Consider secure storage in production

      const db = getDatabase();
      const userRef = ref(db, "users/" + userId);
      let userRole = "user";

      // Wait for data from Firebase
      await new Promise((resolve) => {
>>>>>>> 0863bb9ec12d5eb0b459cb4fe7364321edac34c0
        onValue(userRef, (snapshot) => {
          resolve(snapshot);
        });
      });
      
      const userData = userDataSnapshot.val();
  
      // Nếu người dùng chưa tồn tại trong cơ sở dữ liệu, thêm người dùng
      if (!userData) {
        await set(userRef, {
          email: userEmail,
          username: userName,
          role: userRole
        });
      } else {
        userRole = userData.role || 'user';
      }
  
      // Đọc dữ liệu thú cưng của người dùng từ Firebase sau khi đăng nhập thành công
      const petRef = ref(db, "users/" + userId + "/pets");
      const pets = await new Promise((resolve) => {
        onValue(petRef, (snapshot) => {
          const petData = snapshot.val();
          resolve(petData ? Object.values(petData) : []);
        });
      });
<<<<<<< HEAD
  
      // Lưu dữ liệu thú cưng vào state hoặc localStorage nếu cần
      localStorage.setItem("pets", JSON.stringify(pets));
  
      // Điều hướng dựa trên vai trò của người dùng
=======

      if (!userRole) {
        addDataBase(userId, userEmail, userName, userRole);
      }

      addDataBase(userId, userEmail, userName, userRole);

>>>>>>> 0863bb9ec12d5eb0b459cb4fe7364321edac34c0
      switch (userRole) {
        case "user":
          navigate("/");
          break;
        case "veterinarian":
          navigate("/veterinarian");
          break;
        case "manager":
          navigate("/manager");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
<<<<<<< HEAD
  
      toast.success("Login successfully. Wish you enjoy our best experience");
=======
      console.log(userName);
      toast.success("Login successfully. Wish you enjoy our best experiment");
>>>>>>> 0863bb9ec12d5eb0b459cb4fe7364321edac34c0
    } catch (error) {
      setError(error.message);
      toast.error("Login failed. Please try again.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password not match, please try again!");
      return; // Prevent form submission
    }

    const isUsernameTaken = async (username) => {
      const db = getDatabase();
      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);
      const users = snapshot.val();
      for (let userId in users) {
        if (users[userId].username === username) {
          return true;
        }
      }
      return false;
    };

    if (await isUsernameTaken(username)) {
      toast.error("Username is already taken, please try another!");
      return; // Prevent form submission
    }

    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (!expression.test(email)) {
      toast.error("Email is invalid. Please enter a valid email address.");
      return; // Prevent form submission
    }

    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length > 0) {
      setIsRegistering(false); // Allow user to edit registration info
      toast.error("This email is used by another user, please try again!");
      return; // Prevent form submission
    }

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        const userCredential = await doCreateUserWithEmailAndPassword(
          email,
          password
        );
        const user = userCredential.user;
        const userId = userCredential.user.uid; // Use userCredential.user.uid for unique identifier
        await updateProfile(user, {
          displayName: username,
          role: "user",
        });
        addDataBase(userId, email, username, "user"); // Omit password from user data
        navigate("/"); // Redirect to home page
        toast.success("Login successfully. Wish you enjoy our best experiment");
      } catch (error) {
        // Handle Firebase errors (e.g., weak password)
        toast.error("This email is used by another user, please try again!");
      } finally {
        setIsRegistering(false); // Allow user to edit registration info
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "username") {
      setUsername(value);
    } else if (name === "confirmPassword") {
      setconfirmPassword(value);
    }
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setError(null); // Clear any previous errors

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userEmail = user.email;
      setUserEmail(userEmail);
      localStorage.setItem("email", userEmail); // Consider secure storage in production
      const userId = user.uid;
      const db = getDatabase();
      const userRef = ref(db, "users/" + userId);
      let userRole = "user";

      // Wait for data from Firebase
      await new Promise((resolve) => {
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData && userData.role) {
            userRole = userData.role;
          }
          resolve();
        });
      });

      if (!userRole) {
        // If role is not defined in the database, add it
        addDataBase(userId, userEmail, user.displayName, userRole);
      }
<<<<<<< HEAD
      const petRef = ref(db, "users/" + userId + "/pets");
      const pets = await new Promise((resolve) => {
        onValue(petRef, (snapshot) => {
          const petData = snapshot.val();
          resolve(petData ? Object.values(petData) : []);
        });
      });
  
      // Lưu dữ liệu thú cưng vào state hoặc localStorage nếu cần
      localStorage.setItem("pets", JSON.stringify(pets));
  
=======

>>>>>>> 0863bb9ec12d5eb0b459cb4fe7364321edac34c0
      switch (userRole) {
        case "user":
          navigate("/");
          break;
        case "veterinarian":
          navigate("/veterinarian");
          break;
        case "manager":
          navigate("/manager");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
      toast.success("Login successfully. Wish you enjoy our best experiment");
    } catch (error) {
      toast.error(
        "Something went wrong. Please check your email or password and try again!"
      );
    }
  };

  const handleClickButtonReg = async () => {
    const container = document.getElementById("container");
    container.classList.add("active");
  };
  const handleClickButtonLog = async () => {
    const container = document.getElementById("container");
    container.classList.remove("active");
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setUserEmail(storedEmail);
  }, []); // Empty dependency array ensures it runs only once

  const handleReset = () => {
    navigate("/reset");
  };
  return (
    <div>
      {!userEmail && ( // Only show login options if not logged in
        <>
          <div className="container" id="container">
            <div className="form-container sign-up">
              <form onSubmit={onSubmit}>
                <h1>Create Account</h1>
                <div className="social-icons">
                  <button type="button" onClick={handleGoogleLogin}>
                    Login with Google
                  </button>
                </div>
                <span>or use your email for registeration</span>
                <input
                  id="username"
                  type="username"
                  autoComplete="off"
                  required
                  value={username}
                  placeholder="Input your username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="off"
                  required
                  value={email}
                  placeholder="Input your email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                />
                <input
                  id="password"
                  disabled={isRegistering}
                  placeholder="Input your password"
                  type="password"
                  autoComplete="off"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                />
                <div>
                  <label className="text-sm text-gray-600 font-bold">
                    Confirm Password
                  </label>
                  <input
                    disabled={isRegistering}
                    type="password"
                    placeholder="Confirm your password"
                    autoComplete="off"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setconfirmPassword(e.target.value);
                    }}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                    isRegistering
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
                  }`}
                >
                  {isRegistering ? "Signing Up..." : "Sign Up"}
                </button>
              </form>
            </div>
            <div class="form-container sign-in">
              <form onSubmit={handleEmailLogin}>
                <h1>Sign In</h1>
                <div className="social-icons">
                  <button type="button" onClick={handleGoogleLogin}>
                    Login with Google
                  </button>
                </div>
                <span>or use your email password</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Input your email"
                  value={email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  placeholder="Input your password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                />
                <a href="" onClick={handleReset}>
                  Forget Your Password?
                </a>
                <button>Sign In</button>
              </form>
            </div>
            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-left">
                  <h1>Welcome Back!</h1>
                  <p>Enter your personal details to use all of site features</p>
                  <button
                    className="hidden"
                    id="login"
                    onClick={handleClickButtonLog}
                  >
                    Sign In
                  </button>
                </div>
                <div className="toggle-panel toggle-right">
                  <h1>Hello, Friend!</h1>
                  <p>
                    Register with your personal details to use all of site
                    features
                  </p>
                  <button
                    className="hidden"
                    id="register"
                    onClick={handleClickButtonReg}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {userEmail && <Home />} {/* Render Home if user is logged in */}
    </div>
  );
}

export default SignIn;
