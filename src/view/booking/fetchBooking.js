
const LOCAL_BASE_URL = process.env.REACT_APP_LOCAL_BASE_URL;
const PRODUCTION_BASE_URL = process.env.REACT_APP_PRODUCTION_BASE_URL;
const ENV = process.env.REACT_APP_ENV;

console.log('Environment:', ENV); // Sẽ in ra 'development' hoặc 'production' tùy thuộc vào giá trị bạn thiết lập
console.log('Local Base URL:', LOCAL_BASE_URL); // Sẽ in ra URL cục bộ
console.log('Production Base URL:', PRODUCTION_BASE_URL); // Sẽ in ra URL sản xuất

// Hàm lấy URL cơ sở dựa trên môi trường
const getBaseUrl = () => {
  return ENV === 'production' ? PRODUCTION_BASE_URL : LOCAL_BASE_URL;
};

const BASE_URL = getBaseUrl();

export const fetchBookings = async (userId) => {
  const response = await fetch(`${BASE_URL}/bookings/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
};


export const cancelBooking = async (bookingData) => {
  const response = await fetch(`${BASE_URL}/cancel-booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) {
    throw new Error('Failed to cancel booking');
  }
  return response.json();
};

export const fetchBookingDetails = async (userId, bookingId) => {
  try {
    const response = await fetch(`${BASE_URL}/bookings/${userId}/${bookingId}`);
    if (!response.ok) {
      throw new Error(`Error fetching booking details: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
