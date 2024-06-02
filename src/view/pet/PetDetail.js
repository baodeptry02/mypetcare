import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../Components/firebase/firebase";

const PetDetail = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!user) {
      console.log("No user is currently logged in.");
      return;
    }

    const fetchPetDetails = async () => {
      try {
        const db = getDatabase();
        const petRef = ref(db, `users/${user.uid}/pets/${petId}`);
        const snapshot = await get(petRef);
        if (snapshot.exists()) {
          setPet(snapshot.val());
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };

    fetchPetDetails();
  }, [user, petId]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % pet.imageUrls.length
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + pet.imageUrls.length) % pet.imageUrls.length
    );
  };

  if (!pet) {
    return <p>Loading pet details...</p>;
  }

  // Loại bỏ imageUrls khỏi dữ liệu pet
  const petDetails = { ...pet };
  delete petDetails.imageUrls;

  return (
    <div className="pet-detail-container">
      <div className="pet-images-section">
        <div className="main-image-container">
          <img 
            className="main-image"
            src={pet.imageUrls[currentImageIndex]} 
            alt={`${pet.name} image`} 
          />
        </div>
        <div className="thumbnail-images">
          {pet.imageUrls.map((url, index) => (
            <img
              key={index}
              className={`thumbnail-image ${index === currentImageIndex ? 'active' : ''}`}
              src={url}
              alt={`${pet.name} thumbnail ${index + 1}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
        <div className="navigation-buttons">
          <button onClick={handlePreviousImage}>&lt;</button>
          <button onClick={handleNextImage}>&gt;</button>
        </div>
      </div>
      <div className="pet-info-section">
        <h2>Pet Details</h2>
        <table className="pet-details-table">
          <tbody>
            {Object.entries(petDetails).map(([key, value]) => (
              <tr key={key}>
                <td className="key-column">{key}</td>
                <td className="value-column">
                  {Array.isArray(value) ? value.join(", ") : value.toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default PetDetail;
