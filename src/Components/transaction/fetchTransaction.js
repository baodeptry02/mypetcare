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


export const fetchTransactions = async () => {
  const response = await fetch(`${BASE_URL}/transaction/transactions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  return response.json();
};

export const updateUserBooking = async (data) => {
  const response = await fetch(`${BASE_URL}/transaction/update-booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update user booking');
  }

  return response.json();
};