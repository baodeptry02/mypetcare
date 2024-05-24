import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { auth, imageDb } from "../../Components/firebase/firebase";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import { ScaleLoader } from "react-spinners";

const Pet = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [petCount, setPetCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const petsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  const override = css`
    display: block;
    margin: 500px auto;
    border-color: red;
  `;
  const Loading = () => {
    return (
      <div className="sweet-loading">
        <ScaleLoader
          color={"#123abc"}
          loading={true}
          css={override}
          size={3000}
        />
      </div>
    );
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const db = getDatabase();
        const petRef = ref(db, "users/" + user.uid + "/pets");
        const unsubscribePets = onValue(petRef, (snapshot) => {
          const pets = snapshot.val();
          if (pets) {
            const petList = Object.values(pets); // Chuyển object thành mảng
            setPets(petList);
            setPetCount(petList.length);
            setLoading(false); // Đã hoàn thành fetching, đặt loading thành false
          } else {
            setPets([]);
            setPetCount(0);
            setLoading(false); // Đã hoàn thành fetching, đặt loading thành false
          }
        });
        return () => unsubscribePets();
      } else {
        setUser(null);
        setPets([]);
        setPetCount(0);
        setLoading(false); // Đã hoàn thành fetching, đặt loading thành false
      }
    });
    // Cleanup function để gỡ bỏ listener khi không cần thiết nữa
    return () => unsubscribe();
  }, []);

  const addPet = () => {
    if (user) {
      navigate("/pet/add");
    } else {
      navigate("/signIn"); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    }
  };
  if (loading) {
    return <Loading />;
  }

  // Xác định chỉ mục bắt đầu và chỉ mục kết thúc của danh sách pet trên trang hiện tại
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);

  // Xác định số lượng trang
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(petCount / petsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="parent-container">
      <div className="pet-manage">
        {user ? (
          petCount === 0 ? (
            <div>
              <div className="empty-pet">
                <img src="./Remove-bg.ai_1716049467772.png" alt="No pets" />
              </div>
              <h1>
                Look like you <span>DON'T HAVE</span> any pet in our system.
              </h1>
              <h3>Must add your boss before you proceed to booking</h3>
              <div onClick={addPet} className="btn">
                <FontAwesomeIcon icon={faPaw} /> Add boss!
              </div>
            </div>
          ) : (
            <div className="pet-list">
              <h1>Your Pets</h1>
              <p>Current number of pets: {petCount}</p>
              <div className="grid-container">
                {currentPets.map((pet, index) => (
                  <div key={index} className="pet-card">
                    <div className="pet-card-image">
                      {pet.imageUrls && pet.imageUrls.length > 0 ? (
                        <img
                          src={pet.imageUrls[0]}
                          alt={`${pet.name}'s image`}
                        />
                      ) : (
                        "No image"
                      )}
                    </div>
                    <div className="pet-card-content">
                      <div className="pet-card-header">
                        <span className="pet-name">{pet.name}</span>
                        <span className="pet-color">{pet.color}</span>
                      </div>
                      <div className="pet-card-footer">
                        <span className="pet-gender">{pet.gender}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="add-pet-button">
                <div onClick={addPet} className="btn">
                  <FontAwesomeIcon icon={faPaw} /> Add boss!
                </div>
              </div>
              {pageNumbers.length > 1 && (
                <ul className="pagination">
                  {pageNumbers.map((number) => (
                    <li key={number} className="page-item">
                      <a
                        onClick={() => paginate(number)}
                        href="#"
                        className="page-link"
                      >
                        {number}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        ) : (
          <h1>Please log in to manage your pets.</h1>
        )}
      </div>
    </div>
  );
};

export default Pet;
