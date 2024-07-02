const BASE_URL = 'http://localhost:5000'; 

export const fetchServices = async () => {
    const response = await fetch(`${BASE_URL}/allBookingData/services`);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return response.json();
  };

  export const fetchVets = async () => {
    const response = await fetch(`${BASE_URL}/allBookingData/vets`);
    if (!response.ok) {
      throw new Error('Failed to fetch veterinarians');
    }
    return response.json();
  };
  
  export const fetchAllBookings = async () => {
    const response = await fetch(`${BASE_URL}/allBookingData/bookings`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return response.json();
  };