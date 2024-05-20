import { auth } from "../../Components/firebase/firebase";
import React, { useState } from 'react';
import { getDatabase, ref, set, push } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const AddPet = () => {
  const user = auth.currentUser;
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petGender, setPetGender] = useState("");
  const [petSize, setPetSize] = useState("");
  const [petColor, setPetColor] = useState("");
  const [petVacinated, setPetVacinated] = useState("");
  const [image, setImage] = useState(null); // Ensure the initial state is null
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const addDataBase = (userId, imageUrl) => {
    try {
      const db = getDatabase();
      const petRef = ref(db, 'users/' + userId + '/pets');
      const newPetRef = push(petRef);
      set(newPetRef, {
        name: petName,
        age: petAge,
        gender: petGender,
        size: petSize,
        color: petColor,
        vacinated: petVacinated,
        imageUrl: imageUrl
      });
      toast.success('Pet added successfully. You can view your pet in your collection!');
    } catch (error) {
      alert('Error adding pet: ' + error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      if (image) {
        // Upload image to Firebase Storage
        const storage = getStorage();
        const storageReference = storageRef(storage, `images/${user.uid}/${v4()}`);
        uploadBytes(storageReference, image).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            addDataBase(user.uid, url); // Gọi hàm thêm vào database với URL của ảnh
            setLoading(false);
          }).catch((error) => {
            console.error('Error getting download URL:', error);
            setLoading(false);
          });
        }).catch((error) => {
          console.error('Error uploading image:', error);
          setLoading(false);
        });
      } else {
        addDataBase(user.uid, ""); // Nếu không có ảnh thì vẫn thêm vào database
        setLoading(false);
      }
    } else {
      alert('User not logged in.');
      setLoading(false);
    }
  };

  return (
    <div className="parent-container">
      <div className="container" id="container">
        <h3 className="account-title">Add Info Pet</h3>
        <form onSubmit={handleSubmit}>
          <label>Pet Name</label>
          <input
            id="petname"
            type="text"
            autoComplete="off"
            value={petName}
            placeholder="Enter your pet name"
            onChange={(e) => setPetName(e.target.value)}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
          />
          <label>Pet Gender</label>
          <input
            id="petgender"
            type="text"
            autoComplete="off"
            value={petGender}
            placeholder="Enter your pet gender"
            onChange={(e) => setPetGender(e.target.value)}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
          />
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
          <label>Pet Size</label>
          <input
            id="petsize"
            type="text"
            autoComplete="off"
            required
            value={petSize}
            placeholder="Enter your pet size"
            onChange={(e) => setPetSize(e.target.value)}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
          />
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
          <label>Pet Vacinated</label>
          <input
            id="petvacinated"
            type="text"
            autoComplete="off"
            required
            value={petVacinated}
            placeholder="Enter your pet vacinated"
            onChange={(e) => setPetVacinated(e.target.value)}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
          />
          <label>Pet Image</label>
          <input
            id="petimage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
          />
          <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Pet'}</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddPet;
