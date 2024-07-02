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