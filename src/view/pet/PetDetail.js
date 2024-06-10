import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../../Components/firebase/firebase";

const PetDetail = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const user = auth.currentUser;
  const navigate = useNavigate();

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

  if (!pet) {
    return <p>Loading pet details...</p>;
  }

  const imageUrl = pet.imageUrl;

  // Loại bỏ imageUrl khỏi dữ liệu pet
  const petDetails = { ...pet };
  delete petDetails.imageUrl;

  return (
    <div className="pet-detail-wrapper">

    <div className="pet-detail-container">
      <div className="pet-images-section">
        <div className="main-image-container">
          <img 
            className="main-image"
            src={imageUrl} 
            alt={`${pet.name} image`} 
            />
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
                  {Array.isArray(value) ? value.join(",") : value.toString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
          </div>
  );
};

export default PetDetail;
