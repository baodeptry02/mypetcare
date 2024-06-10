

import React, { useState } from 'react';
import './AddPet.css'; // Import the CSS file
import { ToastContainer } from 'react-toastify';

const AddPetNext = () => {
    // State variables
    const [petName, setPetName] = useState('');
    const [petGender, setPetGender] = useState('male');
    const [petMonth, setPetMonth] = useState('January');
    const [petYear, setPetYear] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [petAge, setPetAge] = useState('');
    const [petSize, setPetSize] = useState('');
    const [petColor, setPetColor] = useState('');
    const [petVaccinated, setPetVaccinated] = useState('');

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Form submission logic here
        console.log({ petName, petGender, petAge, petSize, petColor, petVaccinated });
        setLoading(true); // Simulate loading state
        setTimeout(() => {
          setLoading(false);
          // Handle form submission after a delay (e.g., API call)
        }, 1500);
      };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    return (
         <div className="parent-container">
            <h2 className="title-add-next-pet">Step 2: Add Pet Info</h2>
            <p className='des-add-next-pet'>Tell us more about your Pet</p>
        <div className="container container1 pet-container" id="container">
          
        <div className="image-group">
  <div className="flex items-center">
    <label htmlFor="petimage" className="bg-[#e20074] text-white px-4 py-2 rounded-lg cursor-pointer">
      Upload Photo
    </label>
    <input
      required
      id="petimage"
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="hidden"
    />
    {previewImage && (
      <img
        src={previewImage}
        alt="Pet Preview"
        className="w-24 h-24 ml-4 rounded-lg object-cover"
      />
    )}
  </div>
</div>
          <form onSubmit={handleSubmit} className="grid-container grid-container1">
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
            
            <button type="submit" disabled={loading} className='submit-pet'>
            {loading ? "Uploading..." : <span style={{ fontSize: '12px', color:'white' }}>Add Pet</span>}
            </button>
          </form>
        </div>
        <ToastContainer />
        <div className="img-add-next-pet-thumbnail">
    <img src="https://app.petotum.com/assets/img/wp/petbg.png" />
    </div>
      </div> 
      
);
};

export default AddPetNext;