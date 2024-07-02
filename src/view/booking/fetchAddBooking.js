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

export const addBooking = async (userId, newBooking) => {
  console.log('Sending addBooking request with:', { userId, newBooking });

  const response = await fetch(`${BASE_URL}/addBookingData/booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, newBooking }),
  });

  if (!response.ok) {
    throw new Error('Failed to add booking');
  }

  return response.json();
};

export const updateAccountBalance = async (userId, newBalance) => {
  const response = await fetch(`${BASE_URL}/addBookingData/account-balance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, newBalance }),
  });
  if (!response.ok) {
    throw new Error('Failed to update account balance');
  }
  return response.json();
};

export const updateVetSchedule = async (vetId, date, slot) => {
  const response = await fetch(`${BASE_URL}/addBookingData/vet-schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vetId, date, slot }),
  });
  if (!response.ok) {
    throw new Error('Failed to update vet schedule');
  }
  return response.json();
};