import React, { useState, useEffect, useRef, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { getDatabase, ref, get, update, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import useForceUpdate from "../../../../hooks/useForceUpdate";


const ManagerSchedule = () => {
  const [events, setEvents] = useState([]);
  const [vets, setVets] = useState([]);
  const auth = getAuth();
  const dragContainerRef = useRef(null);
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    const fetchVets = async () => {
      const db = getDatabase();
      const vetsRef = ref(db, "users");
      const snapshot = await get(vetsRef);
      const vetsData = snapshot.val();
      const vetsList = Object.keys(vetsData)
        .filter((uid) => vetsData[uid].role === "veterinarian")
        .map((uid) => ({
          uid,
          name: vetsData[uid].fullname,
          schedule: vetsData[uid].schedule || {},
          specialization: vetsData[uid].specialization,
        }));
      setVets(vetsList);
    };

    fetchVets();
  }, []);

  useEffect(() => {
    const fetchEvents = () => {
      const eventsList = [];
      vets.forEach((vet) => {
        Object.keys(vet.schedule).forEach((date) => {
          if (vet.schedule[date] === true) {
            eventsList.push({
              id: `${vet.uid}-${date}`,
              title: `Work Day - ${vet.name}`,
              start: date,
              allDay: true,
              backgroundColor: "lightgrey",
              borderColor: "lightgrey",
              textColor: "black",
              extendedProps: {
                vetId: vet.uid,
                vetName: vet.name,
              },
            });
          }
        });
      });
      setEvents(eventsList);
    };

    fetchEvents();
  }, [vets]);

  useEffect(() => {
    new Draggable(dragContainerRef.current, {
      itemSelector: ".draggable-item",
      eventData: function (eventEl) {
        const vetId = eventEl.getAttribute("data-vetid");
        const vetName = eventEl.getAttribute("data-vetname");
        return {
          title: `Work Day - ${vetName}`,
          extendedProps: {
            vetId,
            vetName,
          },
          allDay: true,
          backgroundColor: "lightgrey",
          borderColor: "lightgrey",
          textColor: "black",
        };
      },
    });
  }, [vets]);

  const handleEventReceive = useCallback(
    async (info) => {
      const { event } = info;
      const { extendedProps } = event;

      const eventExists = events.some(
        (e) => e.id === `${extendedProps.vetId}-${event.startStr}`
      );

      if (!eventExists) {
        const newEvent = {
          id: `${extendedProps.vetId}-${event.startStr}`,
          title: `Work Day - ${extendedProps.vetName}`,
          start: event.startStr,
          allDay: true,
          backgroundColor: "lightgrey",
          borderColor: "lightgrey",
          textColor: "black",
          extendedProps: {
            vetId: extendedProps.vetId,
            vetName: extendedProps.vetName,
          },
        };

        setEvents((prevEvents) => [...prevEvents, newEvent]);

        const db = getDatabase();
        const updates = {};
        updates[`users/${extendedProps.vetId}/schedule/${event.startStr}`] = true;
        await update(ref(db), updates);

        toast.success("Set schedule for vet successfully!");
      } else {
        toast.error("Vet already got schedule on this day!");
      }
    },
    [events]
  );

  const handleEventClick = async (info) => {
    const { event } = info;

    if (window.confirm(`Delete event '${event.title}'?`)) {
      // Xóa sự kiện khỏi trạng thái
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));

      // Xóa sự kiện khỏi cơ sở dữ liệu
      const db = getDatabase();
      const eventId = event.extendedProps.vetId;
      const eventDate = event.startStr;
      const updates = {};
      updates[`users/${eventId}/schedule/${eventDate}`] = null;
      await update(ref(db), updates);
      event.remove();
    }
  };
  const handleDateClick = (arg) => {
    const newEvent = {
      id: arg.dateStr,
      title: "Work Day",
      start: arg.dateStr,
      allDay: true,
      backgroundColor: "lightgrey",
      borderColor: "lightgrey",
      textColor: "black",
    };
    setEvents([...events, newEvent]);
  
    // Save to database
    const db = getDatabase();
    const updates = {};
    updates[`schedule/${arg.dateStr}`] = true;
    update(ref(db), updates); 
    toast.success("Vet schedule deleted successfully!", {
        autoClose: 2000,
        onClose: () => {
          forceUpdate();
        },
      });
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box p={2} bgcolor="primary.main" color="white">
        <Typography variant="h5">Manage Doctor Schedules</Typography>
      </Box>
      <Box display="flex" flex="1" overflow="hidden">
        <Box flex="1" p={2} overflow="auto" ref={dragContainerRef}>
          <Typography variant="h6">Doctors</Typography>
          <List>
            {vets.map((vet) => (
              <ListItem
                key={vet.uid}
                className="draggable-item"
                data-vetid={vet.uid}
                data-vetname={vet.name}
                draggable
              >
                <ListItemText primary={vet.name} secondary={vet.specialization} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box flex="3">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
            events={events}
            dateClick={handleDateClick}
            eventReceive={handleEventReceive}
            eventClick={handleEventClick}
            droppable={true}
          />
        </Box>
      </Box>
      <ToastContainer/>
    </Box>
  );
};

export default ManagerSchedule;