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

export const fetchPetsByUserId = async (userId) => {
  const response = await fetch(`${BASE_URL}/pets/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch pets');
  }
  return response.json();
};

export const fetchPetDetails = async (userId, petId) => {
    const response = await fetch(`${BASE_URL}/pets/${userId}/${petId}`);
    if (!response.ok) {
      console.error('Failed to fetch pet details', response.statusText);
      throw new Error('Failed to fetch pet details');
    }
    const data = await response.json();
    console.log('Fetched pet details:', data);
    return data;
  };
  
  export const fetchPetMedicalHistory = async (userId, petId) => {
    const response = await fetch(`${BASE_URL}/pets/${userId}/${petId}/medicalHistory`);
    if (!response.ok) {
      console.error('Failed to fetch medical history', response.statusText);
      throw new Error('Failed to fetch medical history');
    }
    const data = await response.json();
    console.log('Fetched medical history:', data);
    return data;
  };

  export const updatePetDetails = async (userId, petId, updatedPetData) => {
    try {
      const response = await fetch(`${BASE_URL}/pets/${userId}/${petId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPetData),
      });
      if (!response.ok) {
        throw new Error(`Error updating pet details: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  export const addPet = async (userId, petData) => {
    try {
      const response = await fetch(`${BASE_URL}/pets/${userId}/addPet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });
      if (!response.ok) {
        throw new Error(`Error adding pet: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };