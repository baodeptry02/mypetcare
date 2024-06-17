import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import { Box, TextField, Button, Typography } from "@mui/material";
import { toast } from 'react-toastify';

const MedicalRecord = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState("");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const db = getDatabase();
        const bookingRef = ref(db, `bookings/${bookingId}`);
        const snapshot = await get(bookingRef);
        const data = snapshot.val();
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleSave = async () => {
    try {
      const db = getDatabase();
      const bookingRef = ref(db, `bookings/${bookingId}`);
      await update(bookingRef, { medicalHistory });
      toast.success("Medical history updated successfully!");
    } catch (error) {
      console.error("Error updating medical history:", error);
      toast.error("Error updating medical history. Please try again.");
    }
  };

  if (!booking) return <div>Loading...</div>;

  return (
    <Box>
      <Typography variant="h4">Booking Details</Typography>
      <Typography variant="h6">Pet Name: {booking.pet.name}</Typography>
      <Typography variant="h6">Services: {booking.services.join(", ")}</Typography>
      <Typography variant="h6">Date: {booking.date}</Typography>
      <Typography variant="h6">Time: {booking.time}</Typography>

      <TextField
        label="Medical History"
        value={medicalHistory}
        onChange={(e) => setMedicalHistory(e.target.value)}
        multiline
        rows={4}
        fullWidth
      />

      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
};

export default MedicalRecord;
