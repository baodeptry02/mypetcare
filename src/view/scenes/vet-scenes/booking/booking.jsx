import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, Typography, useTheme } from "@mui/material";
import { getDatabase, ref, onValue, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "../../../../Components/dashboardChart/Header";

const Booking = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [userEmails, setUserEmails] = useState({});
  const auth = getAuth();
  const navigate = useNavigate();

  const convertScheduleToEvents = (schedule) => {
    const events = [];
    for (const [date, bookings] of Object.entries(schedule)) {
      if (Array.isArray(bookings)) {
        bookings
          .filter((booking) => booking.status === 1) // Only include bookings with status 1
          .forEach((booking, index) => {
            events.push({
              id: `${date}-${index}`,
              title: `Booking with ${booking.username}`,
              start: `${date}T${booking.time}:00`,
              allDay: false,
              extendedProps: {
                services: booking.services.join(", "),
                petName: booking.petName,
                email: booking.userAccount, 
                bookingId: booking.bookingId,
              },
            });
          });
      }
    }
    return events;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const db = getDatabase();
          const userRef = ref(db, "users/" + currentUser.uid);

          onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.schedule) {
              const events = convertScheduleToEvents(data.schedule);
              setCurrentEvents(events);
            }
          });

          // Fetch all users to map emails to UIDs
          const usersRef = ref(db, "users");
          onValue(usersRef, (snapshot) => {
            const usersData = snapshot.val();
            if (usersData) {
              const emailMap = {};
              Object.keys(usersData).forEach((uid) => {
                const user = usersData[uid];
                emailMap[user.email] = uid;
              });
              setUserEmails(emailMap);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [auth]);

  const handleEventClick = async (selected) => {
    const email = selected.event.extendedProps.email;
    const bookingId = selected.event.extendedProps.bookingId;
    console.log(email, bookingId);
  
    const userUid = userEmails[email];
    if (userUid) {
      const db = getDatabase();
      const bookingsRef = ref(db, `users/${userUid}/bookings`);
      const snapshot = await get(bookingsRef);
      const bookingsData = snapshot.val();
  
      if (bookingsData) {
        const bookingKey = Object.keys(bookingsData).find(
          (key) => bookingsData[key].bookingId === bookingId
        );
        if (bookingKey) {
          navigate(`/vet/booking/medical-record/${bookingKey}`);
        } else {
          console.error("Booking key not found for bookingId:", bookingId);
        }
      } else {
        console.error("No bookings found for user:", userUid);
      }
    } else {
      console.error("User not found for email:", email);
    }
  };

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            eventClick={handleEventClick}
            events={currentEvents}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Booking;
