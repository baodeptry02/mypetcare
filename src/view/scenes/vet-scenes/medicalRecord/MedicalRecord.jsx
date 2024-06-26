import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDatabase, ref, get, update, set } from "firebase/database";
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
import { getAuth } from "firebase/auth";
import moment from 'moment-timezone';


const MedicalRecord = () => {
  const { userId, bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [diagnostic, setDiagnostic] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");
  const [cageRequired, setCageRequired] = useState(false);
  const theme = useTheme();
  const [availableCages, setAvailableCages] = useState([]);
  const [selectedCage, setSelectedCage] = useState(null);
  const auth = getAuth();
  const [vetSchedule, setVetSchedule] = useState([]);
  const [user,setUser] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        setUser(userData)

      } catch (error) {
        console.error("Error fetching vet schedule:", error);
      }
    }
    fetchUserData()
  },[userId])

  useEffect(() => {
    const fetchVetSchedule = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const db = getDatabase();
          const vetScheduleRef = ref(db, `users/${currentUser.uid}/schedule`);
          const snapshot = await get(vetScheduleRef);
          const vetScheduleData = snapshot.val();
          if (vetScheduleData) {
            setVetSchedule(vetScheduleData);
            console.log("Fetched vet schedule:", vetScheduleData); // Debugging
          } else {
            console.error("No vet schedule data found");
          }
        }
      } catch (error) {
        console.error("Error fetching vet schedule:", error);
        toast.error("Error fetching vet schedule. Please try again.");
      }
    };

    fetchVetSchedule();
  }, [auth]);


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
  useEffect(() => {
    const fetchCages = async () => {
      try {
        const db = getDatabase();
        const cageRef = ref(db, 'cages');
        const snapshot = await get(cageRef);
        const data = snapshot.val();
        const availableCages = Object.entries(data)
          .filter(([key, cage]) => cage.status === 'Available')
          .map(([key, cage]) => ({ key, ...cage }));
        setAvailableCages(availableCages);
        console.log('Available cages:', availableCages); // Debugging
        if (availableCages.length > 0) {
          setSelectedCage(availableCages[0]); // Select the first available cage
        }
      } catch (error) {
        console.error('Error fetching cages:', error);
      }
    };
  
    fetchCages();
  }, []);

  const handleSave = async () => {
    if (cageRequired) {
      if (availableCages.length === 0) {
        toast.error('No available cages');
        return;
      }
  
      const selectedCage = availableCages[0];
      console.log(selectedCage.key);
  
      try {
        const petDetails = {
          date: moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY'),
          petId: booking.pet.key,
          inCage: true,
        };
  
        await saveMedicalRecord(userId, bookingId, {
          diagnostic,
          symptoms,
          prescription,
          notes,
        });
  
        // Update cage status to 'Occupied'
        const db = getDatabase();
        const cageRef = ref(db, `cages/${selectedCage.key}`);
        const cageSnapshot = await get(cageRef);
        const cageData = cageSnapshot.val();
        const updatedCagePets = [...(cageData?.pets || []), petDetails];
        await update(cageRef, { status: 'Occupied', pets: updatedCagePets });
      } catch (error) {
        console.error('Error saving medical record:', error);
        toast.error('Error saving medical record. Please try again.');
      }
    } else {
      try {
        await saveMedicalRecord(userId, bookingId, {
          diagnostic,
          symptoms,
          prescription,
          notes,
          cageRequired,
        });
        toast.success('Medical record saved successfully!');
      } catch (error) {
        console.error('Error saving medical record:', error);
        toast.error('Error saving medical record. Please try again.');
      }
    }
  };
  
  
  const saveMedicalRecord = async (userId, bookingId, record) => {
    try {
      const db = getDatabase();
      const currentUser = auth.currentUser;
  
      // Kiểm tra currentUser
      if (!currentUser) {
        throw new Error("Current user is not authenticated.");
      }
  
      // Lấy dữ liệu booking hiện tại
      const bookingRef = ref(db, `users/${userId}/bookings/${bookingId}`);
      const bookingSnapshot = await get(bookingRef);
      if (!bookingSnapshot.exists()) {
        throw new Error("Booking not found.");
      }
      const booking = bookingSnapshot.val();
  
      // Cập nhật dữ liệu booking
      const updatedBookingData = {
        ...booking,
        medicalRecord: {
          date: `${booking.date} - ${booking.time}`,
          ...record,
        },
      };
      await update(bookingRef, updatedBookingData);
  
      // Cập nhật dữ liệu lịch trình của bác sĩ thú y
      const vetScheduleRef = ref(db, `users/${currentUser.uid}/schedule/${booking.date}`);
      const vetScheduleSnapshot = await get(vetScheduleRef);
      const vetScheduleData = vetScheduleSnapshot.val();
  
      if (vetScheduleData && Array.isArray(vetScheduleData)) {
        const updatedVetSchedule = vetScheduleData.map((item) => {
          if (item.bookingId === booking.bookingId) {
            return {
              ...item,
              isChecked: true,
            };
          }
          return item;
        });
        await set(vetScheduleRef, updatedVetSchedule);
      } else {
        console.error("Vet schedule data for the specified date is not an array or does not exist");
      }
  
      // Cập nhật lịch sử y tế của thú cưng
      const petRef = ref(db, `users/${userId}/pets/${booking.pet.key}`);
      const petSnapshot = await get(petRef);
      if (!petSnapshot.exists()) {
        throw new Error("Pet not found.");
      }
      const petData = petSnapshot.val();
      const updatedMedicalHistory = petData.medicalHistory || [];
      updatedMedicalHistory.push({
        date: `${booking.date} - ${booking.time}`,
        bookingId: booking.bookingId,
        ...record,
      });
      await update(petRef, { medicalHistory: updatedMedicalHistory });
  
      console.log("Updated pet medical history:", updatedMedicalHistory);
  
      toast.success("Medical history updated successfully!");
    } catch (error) {
      console.error("Error saving medical record:", error);
      toast.error("Error saving medical record. Please try again.");
    }
  };
  
  if (!booking) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: 4,
        borderRadius: "10px",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
        maxWidth: "80%",
        margin: "auto",
        marginTop: "10px",
        marginBottom: "20px",
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h2" gutterBottom>
        Booking Details
      </Typography>
            <img src={booking?.pet?.imageUrl} alt="Pet" style={{ width: "400px", borderRadius: "8px" }} />
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Box>
            <Typography variant="h4">User Info</Typography>
            <Typography>Username: {user?.username}</Typography>
            <Typography>Address: {user?.address || "N/A"}</Typography>
            <Typography>Phone: {user?.phone  || "N/A"}</Typography>
            <Typography>Email: {user?.email}</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box>
            <Typography variant="h4">Pet Info</Typography>
            <Typography>Name: {booking?.pet?.name}</Typography>
            <Typography>Breed: {booking?.pet?.breed}</Typography>
            <Typography>Age: {booking?.pet?.age}</Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3} mt={3}>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
            <FormLabel
              component="legend"
              style={{ fontSize: "1.2rem", color: theme.palette.text.primary }}
            >
              After examination, does the animal need to be kept in a cage?
            </FormLabel>
            <RadioGroup
              row
              value={cageRequired}
              onChange={(e) => setCageRequired(e.target.value === "true")}
              sx={{ justifyContent: 'center', marginTop: '8px' }}
            >
              <FormControlLabel
                value={true}
                control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />}
                label="Yes"
                sx={{ marginRight: '24px' }}
              />
              <FormControlLabel
                value={false}
                control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />}
                label="No"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{
            fontSize: "1.1rem",
            padding: "12px 24px",
            marginRight: "24px"
          }}
        >
          Back
        </Button>
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
