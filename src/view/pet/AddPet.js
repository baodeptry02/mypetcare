import { auth } from "../../Components/firebase/firebase";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, get, query, orderByChild, limitToLast, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from "react-toastify";
import { v4 } from "uuid";

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
        autoClose: 2000 
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
      <div className="parent-container">
        <div className="container pet-container" id="container">
          <h3 className="pet-title account-title">Add Pet Info</h3>
          <form onSubmit={handleSubmit} className="grid-container">
            <div className="form-group">
              <div className="flex-container">
                <div className="flex-item">
                  <label>Pet Name</label>
                  <input
                    required
                    id="petname"
                    type="text"
                    autoComplete="off"
                    value={petName}
                    placeholder="Enter your pet name"
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                  />
                </div>
                <div className="flex-item">
                  <label>Pet Type</label>
                  <div className="pet-type">
                    <label>
                      <input
                        type="radio"
                        name="petType"
                        value="dog"
                        checked={petType === "dog"}
                        onChange={() => setPetType("dog")}
                      />
                      Dog
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="petType"
                        value="cat"
                        checked={petType === "cat"}
                        onChange={() => setPetType("cat")}
                      />
                      Cat
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex-container">
                <div className="flex-item">
                  <label>Pet Age</label>
                  <input
                    id="petage"
                    type="text"
                    autoComplete="off"
                    value={petAge}
                    placeholder="Enter your pet age"
                    onChange={(e) => setPetAge(e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                  />
                </div>
                <div className="flex-item">
                  <label>Pet Size</label>
                  <input
                    required
                    id="petsize"
                    type="text"
                    autoComplete="off"
                    value={petSize}
                    placeholder="Enter your pet size"
                    onChange={(e) => setPetSize(e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                  />
                </div>
              </div>
              <div className="flex-container">
                <div className="flex-item">
                  <label>Pet Color</label>
                  <input
                    id="petcolor"
                    type="text"
                    autoComplete="off"
                    required
                    value={petColor}
                    placeholder="Enter your pet color"
                    onChange={(e) => setPetColor(e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                  />
                </div>
                <div className="flex-item">
                  <label>Pet Vaccinated</label>
                  <input
                    id="petvaccinated"
                    type="text"
                    autoComplete="off"
                    required
                    value={petVaccinated}
                    placeholder="Enter your pet vaccinated status"
                    onChange={(e) => setPetVaccinated(e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                  />
                </div>
              </div>
            </div>
            <div className="image-group">
              <label>Pet Image</label>
              <input
                required
                id="petimage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Pet Preview"
                  style={{ width: '100px', height: '100px' }}
                />
              )}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Add Pet"}
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddPet;
