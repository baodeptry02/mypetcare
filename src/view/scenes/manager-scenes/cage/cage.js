import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import {useTheme, Box, Typography, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Grid, IconButton, InputBase, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from "../../../../theme";


const Cage = () => {
  const [cages, setCages] = useState([]);
  const [vets, setVets] = useState([]);
  const [selectedVets, setSelectedVets] = useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState('');



  useEffect(() => {
    const db = getDatabase();

    const cagesRef = ref(db, "cages");
    onValue(cagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const cageList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setCages(cageList);
      }
    });

    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const vetList = Object.keys(data)
          .map((key) => ({ uid: key, ...data[key] }))
          .filter((user) => user.role === "veterinarian");
        setVets(vetList);
      }
    });
  }, []);

  const handleVetChange = (cageId, vetId) => {
    setSelectedVets((prev) => ({
      ...prev,
      [cageId]: vetId,
    }));
  };

  const handleUpdate = (cageId) => {
    const db = getDatabase();
    const cageRef = ref(db, `cages/${cageId}`);
    update(cageRef, { veterinarian: selectedVets[cageId] });
  };

  const columns = [
    {
      field: "id",
      headerName: "Cage ID",
      width: 150,
      editable: false,
    },
    {
      field: "name",
      headerName: "Cage Name",
      flex: 0.5,
      editable: false,
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      editable: false,
    },
    {
      field: "veterinarian",
      headerName: "Veterinarian",
      flex: 0.7,
      editable: false,
      renderCell: ({ row }) => (
        <FormControl component="fieldset">
          <RadioGroup
            value={selectedVets[row.id] || ""}
            onChange={(e) => handleVetChange(row.id, e.target.value)}
          >
            <FormControlLabel
              value=""
              control={<Radio />}
              label="Select Veterinarian"
              disabled
            />
            {vets.map((vet) => (
              <FormControlLabel
                key={vet.uid}
                value={vet.uid}
                control={<Radio />}
                label={vet.fullname}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ),
    },
    {
      field: "pets",
      headerName: "Pets",
      flex: 1.3,
      editable: false,
      renderCell: ({ value }) => (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {(value || []).map((pet) => (
            <li key={pet.petId} style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              margin: "5px 0",
              backgroundColor: "#fff",
            }}>
              <Typography variant="body1">
                <strong>Pet ID:</strong> {pet.petId}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {pet.date}
              </Typography>
              <Typography variant="body1">
                <strong>In Cage:</strong> {pet.inCage ? "Yes" : "No"}
              </Typography>
            </li>
          ))}
        </ul>
      ),
    },
  ];


  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCages = cages.filter((cage) => {
    return (
      cage.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cage.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const styles = {
    container: { padding: "20px" },
    header: { textAlign: "center", marginBottom: "20px" },
    list: { listStyleType: "none", padding: 0 },
    listItem: { padding: "10px", borderBottom: "1px solid #ccc", marginBottom: "10px" },
    cageDetail: { marginBottom: "10px" },
    select: { marginLeft: "10px" },
    petList: { listStyleType: "none", padding: 0 },
    petListItem: { marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#fff" }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Cages</h1>
      <Box
        display="flex"
        backgroundColor="#f0f0f0"
        borderRadius="3px"
        padding="10px"
        mb="20px"
      >
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search by Cage ID or Name"
          value={searchQuery}
          onChange={handleSearch}
        />
        <IconButton type="button" sx={{ p: 1 }}>
        </IconButton>
      </Box>
      <ul style={styles.list}>
        {filteredCages.map((cage) => {
          const availableVets = vets.filter(
            (vet) =>
              !Object.values(selectedVets).includes(vet.uid) ||
              selectedVets[cage.id] === vet.uid
          );
          return (
            <li key={cage.id} style={styles.listItem}>
              <div style={styles.cageDetail}>
                <strong>ID:</strong> {cage.id}
              </div>
              <div style={styles.cageDetail}>
                <strong>Name:</strong> {cage.name}
              </div>
              <div style={styles.cageDetail}>
                <strong>Status:</strong> {cage.status}
              </div>
              <div style={styles.cageDetail}>
                <label>
                  <strong>Veterinarian:</strong>
                  <select
                    value={selectedVets[cage.id] || ""}
                    onChange={(e) => handleVetChange(cage.id, e.target.value)}
                    style={styles.select}
                  >
                    <option value="" disabled>
                      Select Veterinarian
                    </option>
                    {availableVets.map((vet) => (
                      <option key={vet.uid} value={vet.uid}>
                        {vet.fullname}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div style={styles.cageDetail}>
                <strong>Pets:</strong>
                <ul style={styles.petList}>
                  {(cage.pets || []).map((pet) => (
                    <li key={pet.petId} style={styles.petListItem}>
                      <div>
                        <strong>Pet ID:</strong> {pet.petId}
                      </div>
                      <div>
                        <strong>Date:</strong> {pet.date}
                      </div>
                      <div>
                        <strong>In Cage:</strong> {pet.inCage ? "Yes" : "No"}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUpdate(cage.id)}
              >
                Update
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Cage;
