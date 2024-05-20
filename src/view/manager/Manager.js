import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { auth } from "../../Components/firebase/firebase";
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { ScaleLoader } from 'react-spinners';
import { css } from "@emotion/react";

const Manager = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const Loading = () => {
    return (
      <div className="sweet-loading">
        <ScaleLoader color={'#123abc'} loading={true} css={override} size={150} />
      </div>
    );
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const db = getDatabase();
        const usersRef = ref(db, 'users');
        const unsubscribeUsers = onValue(usersRef, (snapshot) => {
          const usersData = snapshot.val();
          if (usersData) {
            const userList = Object.entries(usersData).map(([uid, userData]) => ({
              uid,
              ...userData
            }));
            const veterinarianUsers = userList.filter(user => user.role === 'veterinarian');
            setUsers(veterinarianUsers);
            setLoading(false);
          } else {
            setUsers([]);
            setLoading(false);
          }
        });
        return () => unsubscribeUsers();
      } else {
        setUser(null);
        setUsers([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="parent-container">
        {user ? (
          <div className="user-list">
            <h1>Veterinarian Management</h1>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.uid}>
                      <td>{index + 1}</td>
                      <td>{user.uid}</td>
                      <td>{user.username}</td>
                      <td>{user.specialization}</td>
                      <td style={{ backgroundColor: user.status === 'Busy' ? 'red' : 'green' }}>
                  {user.status}
                </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <h1>Please log in to manage users.</h1>
        )}
    </div>
  );
};

export default Manager;
