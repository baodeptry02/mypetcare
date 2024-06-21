import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";

const MedicalRecord = () => {
  const { userId, bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [diagnostic, setDiagnostic] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");
  const [cageRequired, setCageRequired] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchBookingDetails(userId, bookingId);
  }, [userId, bookingId]);

  const fetchBookingDetails = async (userId, bookingId) => {
    try {
      const db = getDatabase();
      const bookingRef = ref(db, `users/${userId}/bookings/${bookingId}`);
      const snapshot = await get(bookingRef);
      const data = snapshot.val();
      console.log("Fetched booking data:", data);
      if (data) {
        setBooking(data);
        if (data.medicalRecord) {
          setDiagnostic(data.medicalRecord.diagnostic || "");
          setSymptoms(data.medicalRecord.symptoms || "");
          setPrescription(data.medicalRecord.prescription || "");
          setNotes(data.medicalRecord.notes || "");
          setCageRequired(data.medicalRecord.cageRequired || false);
        }
      } else {
        console.error("No booking data found");
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const handleSave = async () => {
    try {
      await saveMedicalRecord(userId, bookingId, {
        diagnostic,
        symptoms,
        prescription,
        notes,
        cageRequired,
      });
    } catch (error) {
      console.error("Error saving medical record:", error);
    }
  };

  const saveMedicalRecord = async (userId, bookingId, record) => {
    try {
      const db = getDatabase();
      const bookingRef = ref(db, `users/${userId}/bookings/${bookingId}`);
      const updatedBookingData = {
        ...booking,
        medicalRecord: {
          date: `${booking.date} - ${booking.time}`,
          ...record,
        },
      };
      await update(bookingRef, updatedBookingData);
      toast.success("Medical history updated successfully!");

      const petRef = ref(db, `users/${userId}/pets/${booking.pet.key}`);
      const petSnapshot = await get(petRef);
      const petData = petSnapshot.val();
      const updatedMedicalHistory = petData.medicalHistory || [];
      updatedMedicalHistory.push({
        date: `${booking.date} - ${booking.time}`,
        bookingId: booking.bookingId,
        ...record,
      });
      await update(petRef, { medicalHistory: updatedMedicalHistory });

      console.log("Updated pet medical history:", updatedMedicalHistory); // Log updated medical history
    } catch (error) {
      console.error("Error updating medical history:", error);
      toast.error("Error updating medical history. Please try again.");
    }
  };

  if (!booking) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: 4,
        borderRadius: "8px",
        boxShadow: 4,
        maxWidth: "80%",
        margin: "auto",
        marginTop: "10px",
        marginBottom: "20px",
        padding: "20px",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
        borderRadius: "10px",
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h2" gutterBottom>
        Booking Details
      </Typography>
      <Typography variant="h4">Pet Name: {booking.pet.name}</Typography>
      <Typography variant="h4">
        Services: {booking.services.join(", ")}
      </Typography>
      <Typography variant="h4">Date: {booking.date}</Typography>
      <Typography variant="h4" gutterBottom>
        Time: {booking.time}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Diagnostic"
            value={diagnostic}
            onChange={(e) => setDiagnostic(e.target.value)}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              style: { fontSize: "1.2rem", color: theme.palette.text.primary },
            }}
            InputProps={{
              style: { fontSize: "1.5rem", color: theme.palette.text.primary },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              style: { fontSize: "1.2rem", color: theme.palette.text.primary },
            }}
            InputProps={{
              style: { fontSize: "1.5rem", color: theme.palette.text.primary },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Prescription"
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              style: { fontSize: "1.2rem", color: theme.palette.text.primary },
            }}
            InputProps={{
              style: { fontSize: "1.5rem", color: theme.palette.text.primary },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              style: { fontSize: "1.2rem", color: theme.palette.text.primary },
            }}
            InputProps={{
              style: { fontSize: "1.5rem", color: theme.palette.text.primary },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend" style={{ fontSize: "1.2rem", color: theme.palette.text.primary }}>
              After examination, does the animal need to be kept in a cage?
            </FormLabel>
            <RadioGroup
              row
              value={cageRequired}
              onChange={(e) => setCageRequired(e.target.value === 'true')}
            >
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{
            fontSize: "1.1rem",
            padding: "12px 24px",
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default MedicalRecord;
