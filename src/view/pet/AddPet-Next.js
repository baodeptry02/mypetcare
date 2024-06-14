import React, { useState } from "react";
import "./AddPet.css"; // Import the CSS file
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, push, set, get } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "firebase/auth"; // Import Firebase auth for getting current user

const AddPetNext = () => {
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petGender, setPetGender] = useState("male");
  const [petSize, setPetSize] = useState("");
  const [petColor, setPetColor] = useState("");
  const [petVaccinated, setPetVaccinated] = useState("");
  const [image, setImage] = useState(null); // State for single image
  const [images, setImages] = useState([]); // State for multiple images
  const [loading, setLoading] = useState(false);
  const [petDob, setPetDob] = useState("");
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase auth

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files.length === 1) {
      setImage(e.target.files[0]); // For single image
    } else {
      setImages(Array.from(e.target.files)); // For multiple images
    }
  };

  // Upload multiple images and return their URLs
  const uploadImages = async (userId) => {
    const storage = getStorage();
    const uploadPromises = images.map((image) => {
      const imageRef = storageRef(storage, `pets/${userId}/${uuidv4()}`);
      return uploadBytes(imageRef, image).then((snapshot) =>
        getDownloadURL(snapshot.ref)
      );
    });
    return Promise.all(uploadPromises);
  };

  // Add pet data to the Firebase Realtime Database
  const addDataBase = async (userId, imageUrls) => {
    try {
      const db = getDatabase();
      const newPetRef = push(ref(db, `users/${userId}/pets`));
      await set(newPetRef, {
        name: petName,
        age: petAge,
        gender: petGender,
        size: petSize,
        color: petColor,
        vaccinated: petVaccinated,
        imageUrls: imageUrls,
      });
      toast.success(
        "Pet added successfully. You can view it in your collection!"
      );
    } catch (error) {
      toast.error("Error adding pet: " + error.message);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      if (images.length > 0) {
        // Upload multiple images to Firebase Storage
        uploadImages(user.uid)
          .then((imageUrls) => {
            addDataBase(user.uid, imageUrls);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error uploading images:", error);
            setLoading(false);
          });
      } else if (image) {
        // Upload single image to Firebase Storage
        const storage = getStorage();
        const storageReference = storageRef(
          storage,
          `pets/${user.uid}/${uuidv4()}`
        );
        uploadBytes(storageReference, image)
          .then((snapshot) => {
            getDownloadURL(snapshot.ref)
              .then((url) => {
                addDataBase(user.uid, [url]); // Call add to database with the URL of the image
                setLoading(false);
              })
              .catch((error) => {
                console.error("Error getting download URL:", error);
                setLoading(false);
              });
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            setLoading(false);
          });
      } else {
        // If no image is provided, still add to the database with empty image URLs
        addDataBase(user.uid, []);
        setLoading(false);
      }
    } else {
      toast.error("User not logged in.");
      setLoading(false);
    }
  };
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Hàm xử lý khi người dùng thay đổi ngày sinh
  const handleDobChange = (event) => {
    const dob = event.target.value;
    const age = calculateAge(dob);
    setPetAge(age); // Cập nhật tuổi thú cưng dựa trên ngày sinh
    setPetDob(dob); // Cập nhật ngày sinh thú cưng
  };

  return (
    <div className="parent-container parent-container1">
      <h2 className="title-add-next-pet">Step 2: Add Pet Info</h2>
      <p className="des-add-next-pet">Tell us more about your Pet</p>
      <div className="container container1 pet-container" id="container">
        <div className="image-group">
          <div className="flex items-center">
            <label
              htmlFor="petimage"
              className="bg-[#e20074] text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              Upload Photo
            </label>
            <input
              id="petimage"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Pet Preview"
                className="w-24 h-24 ml-4 rounded-lg object-cover"
              />
            )}
            {images.length > 0 && (
              <div className="flex flex-wrap mt-2">
                {Array.from(images).map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt={`Pet Preview ${index + 1}`}
                    className="w-24 h-24 ml-4 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid-container grid-container1"
        >
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
            </div>
            <div className="flex-container">
              <div className="flex-item">
                <label>D.O.B</label>
                <input type="date" value={petDob} onChange={handleDobChange} />
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
            <div className="flex-item">
              <label htmlFor="petgender">Gender</label>
              <select
                id="petgender"
                value={petGender}
                onChange={(e) => setPetGender(e.target.value)}
                className="input-field"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
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
          <div>
            <button type="submit" disabled={loading} className="submit-pet">
              {loading ? (
                "Uploading..."
              ) : (
                <span style={{ fontSize: "12px", color: "white" }}>
                  Add Pet
                </span>
              )}
            </button>
            <button
              type="button"
              className="submit-pet"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
      <div className="img-add-next-pet-thumbnail">
        <img
          src="https://app.petotum.com/assets/img/wp/petbg.png"
          alt="Pet Background"
        />
      </div>
    </div>
  );
};

export default AddPetNext;
