import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from "@mui/material";
import { getDatabase, ref, push, get, child } from "firebase/database";
import { toast } from 'react-toastify';

const Cage = () => {
  const initialCage = {
    name: '',
    status: 'Available',
    id: ''
  };

  const [cage, setCage] = useState(initialCage);
  const db = getDatabase();

  const addCage = (cage) => {
    const cagesRef = ref(db, 'cages');
    return push(cagesRef, cage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCage({
      ...cage,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const cagesRef = ref(db, 'cages');
    const snapshot = await get(cagesRef);
    const cagesData = snapshot.val() || {};

    const isNameOrIdDuplicate = Object.values(cagesData).some(
      (existingCage) => existingCage.name === cage.name || existingCage.id === cage.id
    );

    if (isNameOrIdDuplicate) {
      toast.error("Name or ID already exists. Please use a unique name and ID.");
    } else {
      addCage(cage)
        .then(() => {
          toast.success("Cage added successfully!");
          setCage(initialCage);
        })
        .catch((error) => {
          toast.error("Failed to add cage: " + error.message);
        });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', backgroundColor: "#ccc" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add Cage
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={cage.name}
            onChange={handleChange}
            required
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="ID"
            name="id"
            value={cage.id}
            onChange={handleChange}
            required
          />
        </Box>
        <Button type="submit" variant="contained" color="primary">
          Add Cage
        </Button>
      </form>
    </Box>
  );
};

export default Cage;
