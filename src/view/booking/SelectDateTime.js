import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../../Components/context/BookingContext';
import { getDatabase, ref, get, child, set, update } from "firebase/database";

const generateTimeSlots = (startTime, endTime, interval) => {
  const slots = [];
  let currentTime = startTime;

  while (currentTime < endTime) {
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    slots.push({ timeString, formattedTime });
    currentTime += interval;
  }

  return slots;
};

const saveBooking = async (vetUid, date, time, petId, serviceNames) => {
  const db = getDatabase();
  
  // Update the booking slot for the veterinarian
  const bookingSlotRef = ref(db, `users/${vetUid}/bookingSlots/${date}`);
  const bookingSlotSnapshot = await get(bookingSlotRef);
  let bookedSlots = bookingSlotSnapshot.val() || [];
  bookedSlots.push(time);

  await update(ref(db, `users/${vetUid}/bookingSlots`), {
    [date]: bookedSlots
  });

  // Save booking details
  const bookingRef = ref(db, `bookings/${vetUid}/${date}/${time}`);
  await set(bookingRef, {
    petId,
    serviceNames,
    time,
  });
};

const SelectDateTime = () => {
  const { selectedPet, selectedServices, setSelectedDateTime } = useContext(BookingContext);
  const [date, setDate] = useState('');
  const [vet, setVet] = useState('');
  const [vets, setVets] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const navigate = useNavigate();
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isDateInputFocused, setIsDateInputFocused] = useState(false);

  useEffect(() => {
    if (!selectedPet) {
      navigate('/book/select-pet');
    } else if (selectedServices.length === 0) {
      navigate('/book/select-service');
    }
  }, [selectedPet, selectedServices, navigate]);

  useEffect(() => {
    const fetchVets = async () => {
      const db = getDatabase();
      const vetsRef = ref(db, 'users');
      const snapshot = await get(vetsRef);
      const vetsData = snapshot.val();
      const vetsList = Object.keys(vetsData)
        .filter(uid => vetsData[uid].role === 'veterinarian')
        .map(uid => ({ uid, name: vetsData[uid].fullname }));
      setVets(vetsList);
    };

    fetchVets();
  }, []);

  useEffect(() => {
    const fetchAllBookedSlots = async () => {
      const db = getDatabase();
      const bookingsRef = ref(db, 'bookings');
      const snapshot = await get(bookingsRef);
      const bookingsData = snapshot.val();
      let allBookedSlots = [];
  
      if (bookingsData) {
        Object.keys(bookingsData).forEach(vetUid => {
          Object.keys(bookingsData[vetUid]).forEach(date => {
            Object.keys(bookingsData[vetUid][date]).forEach(time => {
              allBookedSlots.push({ vetUid, date, time });
            });
          });
        });
      }
  
      setBookedSlots(allBookedSlots);
    };
  
    fetchAllBookedSlots();
  }, []);

  useEffect(() => {
    console.log('Selected Date:', date);
    console.log('Selected Vet:', vet);
    console.log('Booked Slots:', bookedSlots);
  }, [date, vet, bookedSlots]);

  const morningSlots = generateTimeSlots(600, 720, 15); // 10:00 AM to 11:45 AM
  const afternoonSlots = generateTimeSlots(720, 1080, 15); // 12:00 PM to 4:45 PM

  const handleNext = async () => {
    if (date && vet && selectedTime) {
      const selectedVet = vets.find(v => v.name === vet);

      // Extracting the names of the selected services
      const serviceNames = selectedServices.map(service => service.name);

      // Add debugging logs to check the values
      console.log('Selected Vet UID:', selectedVet.uid);
      console.log('Selected Date:', date);
      console.log('Selected Time:', selectedTime);
      console.log('Selected Pet ID:', selectedPet.petId);
      console.log('Selected Service Names:', serviceNames);

      if (!selectedPet.petId || serviceNames.length === 0) {
        alert('Pet ID or Service Names are missing. Please check your selection.');
        return;
      }

      try {
        await saveBooking(selectedVet.uid, date, selectedTime, selectedPet.petId, serviceNames);
        setSelectedDateTime({ date, time: selectedTime, vet });
        navigate('/book/booking-confirm');
      } catch (error) {
        console.error('Error saving booking:', error);
        alert('There was an error saving your booking. Please try again.');
      }
    } else {
      alert('Please select a date, vet, and time.');
    }
  };

  const selectedVetUid = vets.find(v => v.name === vet)?.uid;
  const renderTimeSlots = (slots) => {
    return slots.map((slot, index) => {
      const isBooked = bookedSlots.some(
        bookedSlot => bookedSlot.vetUid === selectedVetUid && bookedSlot.date === date && bookedSlot.time === slot.timeString
      );
  
      return (
        <button
          key={slot.timeString}
          onClick={() => setSelectedTime(slot.timeString)}
          className={selectedTime === slot.timeString ? 'selected' : ''}
          style={{ margin: '5px', width: "100px" }} // Adjust width to fit 4 buttons in a row
          disabled={isBooked}
        >
          {slot.formattedTime}
        </button>
      );
    });
  };

  if (!selectedPet || selectedServices.length === 0) {
    return (
      <div className="date-time-selection">
        <h1>No pet or services selected. Please go back and select a pet and services.</h1>
        <button onClick={() => navigate('/book/select-pet')}>Go Back to Pet Selection</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "250px", height: "100vh" }}>
      <div className="date-time-selection">
        <h1>Select Date and Time for {selectedPet.name}</h1>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} // Only allow selection from today onwards
            required           
            onKeyPress={(e) => e.preventDefault()} // This will prevent the user from typing in the input field
          />
        </div>
        <div>
          <label htmlFor="vet">Vet:</label>
          <select
            id="vet"
            value={vet}
            onChange={(e) => setVet(e.target.value)}
            required
          >
            <option value="">Select a Vet</option>
            {vets.map((vet) => (
              <option key={vet.uid} value={vet.name}>
                {vet.name}
              </option>
            ))}
          </select>
        </div>
        {date && vet && (
          <>
            <h2>Morning Slots</h2>
            <div className="time-slots">
              <div className="slot-row">
                {renderTimeSlots(morningSlots.slice(0, 4))}
              </div>
              <div className="slot-row">
                {renderTimeSlots(morningSlots.slice(4))}
              </div>
            </div>
            <h2>Afternoon Slots</h2>
            <div className="time-slots">
              <div className="slot-row">
                {renderTimeSlots(afternoonSlots.slice(0, 4))}
              </div>
              <div className="slot-row">
                {renderTimeSlots(afternoonSlots.slice(4, 8))}
              </div>
              <div className="slot-row">
                {renderTimeSlots(afternoonSlots.slice(8, 12))}
              </div>
              <div className="slot-row">
                {renderTimeSlots(afternoonSlots.slice(12, 16))}
              </div>
              <div className="slot-row">
                {renderTimeSlots(afternoonSlots.slice(16, 20))}
              </div>
            </div>
          </>
        )}
        <button onClick={handleNext} disabled={!date || !vet || !selectedTime}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SelectDateTime;
