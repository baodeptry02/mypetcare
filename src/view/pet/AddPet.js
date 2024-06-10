import { auth } from "../../Components/firebase/firebase";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, get, query, orderByChild, limitToLast, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from "react-toastify";
import { v4 } from "uuid";
import { useNavigate } from 'react-router-dom'

const AddPet = () => {
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petType, setPetType] = useState("dog"); // Default to dog
  const [petSize, setPetSize] = useState("");
  const [petColor, setPetColor] = useState("");
  const [petVaccinated, setPetVaccinated] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [update, setUpdate] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const forceUpdate = () => {
    setUpdate(!update);
  };
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    navigate("/pet/add/details");
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const imagePreview = URL.createObjectURL(file);
    setPreviewImage(imagePreview);
  };

  const uploadImage = async (userId) => {
    const storage = getStorage();
    const storageReference = storageRef(storage, `images/${userId}/${v4()}`);
    const snapshot = await uploadBytes(storageReference, image);
    return getDownloadURL(snapshot.ref);
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const capitalizedPetName = capitalizeFirstLetter(petName);
  const capitalizedPetType = capitalizeFirstLetter(petType);
  const capitalizedPetColor = capitalizeFirstLetter(petColor);
  const capitalizedPetSize = capitalizeFirstLetter(petSize);
  const capitalizedPetVaccinated = capitalizeFirstLetter(petVaccinated);
  const capitalizedPetAge = capitalizeFirstLetter(petAge);

  const addDataBase = async (userId, imageUrl) => {
    try {
      const db = getDatabase();
      const newPetRef = push(ref(db, `users/${userId}/pets`));
      await set(newPetRef, {
        name: capitalizedPetName,
        age: capitalizedPetAge,
        type: capitalizedPetType,
        size: capitalizedPetSize,
        color: capitalizedPetColor,
        vaccinated: capitalizedPetVaccinated,
        imageUrl: imageUrl,
      });
      toast.success("Pet added successfully. You can view it in your collection!", {
        autoClose: 2000,
        onClose: () => {
          forceUpdate();
        }
      });
    } catch (error) {
      alert("Error adding pet: " + error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      if (image) {
        // Upload single image to Firebase Storage
        uploadImage(user.uid)
          .then((imageUrl) => {
            addDataBase(user.uid, imageUrl);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            setLoading(false);
          });
      } else {
        toast.error("Please upload an image for your pet.");
        setLoading(false);
      }
    } else {
      alert("User not logged in.");
      setLoading(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setImage(null);
    setPetName("");
    setPetAge("");
    setPetColor("");
    setPetSize("");
    setPetType("dog"); // Reset to default type
    setPetVaccinated("");
    setPreviewImage(null);

    const fileInput = document.getElementById("petimage");
    if (fileInput) {
      fileInput.value = ""; // Clear the value of the file input
    }

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <section className="section-addpet">
        
      <div className="add-pet-container">
      <h2 className="title-addpet">Step 1: Add Your Pet</h2>
      <div className="line"></div>
      <p className="des-addpet">Choose your pet category</p>
      <div className="pet-options">
        <div
          className={`pet-option ${petType === 'cat' ? 'selected' : ''}`}
          onClick={() => setPetType('cat')}
        >
          <img src="https://app.petotum.com/assets/img/icon/select-cat.png" alt="Cat" />
          <span className="checkmark">&#10003;</span>
        </div>
        <div
          className={`pet-option ${petType === 'dog' ? 'selected' : ''}`}
          onClick={() => setPetType('dog')}
        >
          <img src="https://app.petotum.com/assets/img/icon/select-dog.png" alt="Dog" />
          <span className="checkmark">&#10003;</span>
        </div>
      </div>
      <div className="navigation-buttons">
        <a className="back-link" href="/pet">Back</a>
        <a className="next-link" onClick={handleNext}>Next</a>
      </div>
    </div>
    
    <div className="img-addpet-thumbnail">
    <img src="https://app.petotum.com/assets/img/wp/petbg.png" />
    </div>
    </section>
    </div>
  );
};

export default AddPet;