

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

export const fetchUserById = async (userId) => {
  const response = await fetch(`${BASE_URL}/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
};

export const updateUserById = async (userId, updates) => {
  const response = await fetch(`${BASE_URL}/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update user data');
  }
  return response.json();
};


export const uploadAvatar = async (userId, file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`${BASE_URL}/${userId}/avatar`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload avatar');
  }

  return response.json();
};
