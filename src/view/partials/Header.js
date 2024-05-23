import React, { useState, useEffect, useRef  } from 'react';
import { auth } from "../../Components/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import {updateProfile  } from "firebase/auth"; 
import { getDatabase, ref, onValue, update } from "firebase/database";

function Header() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setfullname] = useState("");
  const user = auth.currentUser;
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const logout = () => {
    auth.signOut().then(() => {
      localStorage.clear();
      navigate("/");
      toggleDropdown();
    });
  };
  

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userId) {
      const db = getDatabase();
      const userRef = ref(db, "users/" + userId);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const username = setUsername(data.username);
          const fullname = setfullname(data.fullname);
        }
      });
    }
  }, [userId]);

  
  const homePage = () => {
    toggleDropdown();
    navigate("/")
  }

  const updateAccount = async () => {
    toggleDropdown();
    setIsLoading(true); // Set loading to true when starting the update
    try {
      // Update displayName in Firebase
      await updateProfile(auth.currentUser, {
        displayName: user.username,
      });
      navigate("/account");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false when the update is done
    }
  };
  const pet = () => {
    toggleDropdown();
    navigate("/pet")
  }

  useEffect(() => {
    if (user) {
      setIsLoading(false); // Set loading to false when user data is loaded
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading message while loading
  }

  const login = () => {
    navigate("/signIn")
  }

  const aboutPage = () => {
    toggleDropdown();
    navigate("/about")
  }

  return(
    <header className="header">
      <div onClick={homePage} className="logo"><FontAwesomeIcon icon={faPaw} /> Pet Center</div>
      <i className="bx bx-menu" id="menu-icon"></i>
      <nav className="navbar">
        <a href='#home' onClick={homePage} className="active home">Home</a>
        <a onClick={homePage} href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
        {user ? (
          <div className="dropdown">
            <span onClick={toggleDropdown} className="username">{user.displayName || username || fullname}</span>
            <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
              <div onClick={updateAccount}>Account</div>
              <div onClick={pet}>Pet</div>
              <div onClick={logout}>Logout</div>
            </div>
          </div>
        ) : (
          <button onClick={login}>Login</button>
        )}

      </nav>
    </header>
  );
}

export default Header;