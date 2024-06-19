import React, { useState, useEffect } from "react";
import { auth } from "../../Components/firebase/firebase"; 
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth"; 
import { getDatabase, ref, onValue, update } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import useForceUpdate from '../../hooks/useForceUpdate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { TextField, Button, Container, Box, Typography } from '@mui/material';

function Update() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [userId, setUserId] = useState("");
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(true);
  const [userUpdated, setUserUpdated] = useState(false); 
  const navigate = useNavigate();
  const user = auth.currentUser;
  const forceUpdate = useForceUpdate(); // use the custom hook


  useEffect(() => {
    if (user) {
      setUserId(user.uid);
      setEmail(localStorage.getItem('email') || '');
      setUsername(localStorage.getItem('username') || '');
      setPhone('');
      setAddress('');
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      const db = getDatabase();
      const userRef = ref(db, "users/" + userId);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setEmail(data.email);
          setUsername(data.username);
          setPhone(data.phone);
          setAddress(data.address);
          setFullname(data.fullname);
          setAccountBalance(data.accountBalance);
        }
        setLoading(false);
      });
    }
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const updates = {};
    if (email) {
      updates.email = email;
      localStorage.setItem('email', email);
    }
    if (username) {
      updates.username = username;
      localStorage.setItem('username', username);
    }
    if (accountBalance) {
      updates.accountBalance = accountBalance;
      localStorage.setItem('accountBalance', accountBalance);
    }
    if (phone) {
      updates.phone = phone;
    }
    if (address) {
      updates.address = address;
    }
    if (fullname) {
      updates.fullname = fullname;
    }

    if (Object.keys(updates).length > 0) {
      const user = auth.currentUser;
      if (user) {
        try {
          await updateProfile(user, {
            displayName: username,
            phone: phone,
            address: address,
            fullname: fullname
          });

          await update(ref(getDatabase(), "users/" + userId), updates);
          setUserUpdated(true); 
          toast.success("Cập nhật thành công !!!", {
            onClose: () => {
              navigate("/account")
              forceUpdate();
            },
          });
        } catch (error) {
          toast.error("Lỗi");
        }
      }
    } else {
      toast.warning("Không có thay đổi để cập nhật");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userUpdated) {
      setUserUpdated(false);
      setEmail(localStorage.getItem('email') || '');
      setUsername(localStorage.getItem('username') || '');
    }
  }, [userUpdated]);
  const styles = {
    inputLabel: {
      fontSize: '1.3rem',
    },
    input: {
      fontSize: '1.1rem',
    }
  };

  return (
    <div style={{height: "100vh"}} className="update-account-page">
      <Container maxWidth="sm" className="container-update" id="container">
        <Box className="account" sx={{ mt: 8, p: 3, borderRadius: 2 }}>
          <Typography sx={{textAlign: "left"}} variant="h4" className="account-title" gutterBottom>
            Update Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box className="account-balance-display" sx={{ mb: 2 }}>
              Account Balance: {accountBalance}
            </Box>
            
            <Box className="mid-form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                id="username"
                label="Username"
                type="text"
                autoComplete="off"
                required
                value={username}
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
                disabled
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: styles.inputLabel }}
                InputProps={{ style: styles.input }}
              />
              <TextField
                id="fullname"
                label="Full Name"
                type="text"
                autoComplete="off"
                value={fullname}
                placeholder="Enter your full name"
                onChange={(e) => setFullname(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: styles.inputLabel }}
                InputProps={{ style: styles.input }}
              />
              </Box>
              <Box>
              <TextField
                id="email"
                label="Email"
                type="email"
                autoComplete="off"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: styles.inputLabel }}
                InputProps={{ style: styles.input }}
                disabled
              />
              <TextField
                id="phone"
                label="Phone"
                type="text"
                autoComplete="off"
                value={phone}
                placeholder="Enter your phone"
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: styles.inputLabel }}
                InputProps={{ style: styles.input }}
              />
              <TextField
                id="address"
                label="Address"
                type="text"
                autoComplete="off"
                value={address}
                placeholder="Enter your address"
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: styles.inputLabel }}
                InputProps={{ style: styles.input }}
              />
            </Box>
              <ToastContainer/>
  
            <Box className="update-button-container" sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading ? "Updating..." : "Update"}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </div>
  );
}

export default Update;
