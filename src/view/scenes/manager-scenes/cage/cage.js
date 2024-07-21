import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update, get } from "firebase/database";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

import {
  Box,
  useTheme,
  IconButton,
  Button,
  MenuItem,
  Typography,
  Pagination,
  Select,
  Modal,
  Input,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import Header from "../../../../Components/dashboardChart/Header";
import {
  getCages,
  addNewCage,
  addNewService,
  getCageByKey,
  updateCageByKey,
} from "../../admin-scenes/services and cages/getServiceNCageData";
import { getAllUsers } from "../../../account/getUserData";
import { toast } from "react-toastify";
import moment from "moment";

const RoleEditCell = ({ id, value, api, vets, handleVetChange }) => {
  const [selectedVetId, setSelectedVetId] = useState(value ? value.id : "");

  const handleChange = (event) => {
    const vetId = event.target.value;
    const selectedVet = vets.find((vet) => vet.id === vetId);
    setSelectedVetId(vetId);
    handleVetChange(id, selectedVet);
    api.setEditCellValue({
      id: id,
      field: "veterinarian",
      value: selectedVet.fullname,
    });
  };

  return (
    <div className="role-menu">
      <Select value={selectedVetId} onChange={handleChange} autoFocus fullWidth>
        {vets.map((vet) => (
          <MenuItem key={vet.id} sx={{ fontSize: "16px" }} value={vet.id}>
            {vet.fullname}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

const Cage = () => {
  const [cages, setCages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vets, setVets] = useState([]);
  const [selectedVets, setSelectedVets] = useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingVet, setEditingVet] = useState(null);
const [vetName, setVetName] = useState("");
  const rowsPerPage = 5;
  
  const addPetToCage = async (bookingId, cageKey, username) => {
    try {
      const db = getDatabase();
      const usersData = await getAllUsers();
  
      console.log("Users Data:", usersData); // Log dữ liệu người dùng
  
      let userId = null;
      let booking = null;
  
      for (const uid in usersData) {
        const userData = usersData[uid];
  
        if (userData.username === username) {
          console.log(`Checking user ${uid} (username: ${username}) for booking ID ${bookingId}`); // Log quá trình tìm kiếm
          if (userData.bookings) {
            for (const bid in userData.bookings) {
              if (userData.bookings[bid].bookingId === bookingId) {
                userId = uid;
                booking = userData.bookings[bid];
                console.log("Found booking:", booking); // Log thông tin booking
                break;
              }
            }
          }
        }
  
        if (userId && booking) {
          break; // Thoát vòng lặp khi tìm thấy booking
        }
      }
  
      if (!userId || !booking) {
        throw new Error(`Booking with ID ${bookingId} not found for user ${username}.`);
      }
  
      // Kiểm tra trạng thái của booking
      if (booking.status !== 'Rated' && booking.status !== 'Checked-in') {
        throw new Error(`Booking status must be 'Rated' or 'Checked-in' to add pet to cage.`);
      }
  
      const cageRef = ref(db, `cages/${cageKey}`);
      const cageSnapshot = await get(cageRef);
      if (!cageSnapshot.exists()) {
        throw new Error(`Cage with key ${cageKey} not found.`);
      }
      const cageData = cageSnapshot.val();
      console.log("Cage Data:", cageData); // Log dữ liệu cage
  
      if (cageData.status !== "Available") {
        throw new Error(`Cage with key ${cageKey} is not available.`);
      }
  
      const petDetails = {
        date: moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY"),
        petId: booking.pet.key,
        inCage: true,
        bookingId: bookingId,
        petName: booking.pet.name,
        petOwner: usersData[userId].username,
      };
      console.log("Pet Details:", petDetails); // Log thông tin pet
  
      const updatedCagePets = [...(cageData.pets || []), petDetails];
      console.log("Updated Cage Pets:", updatedCagePets); // Log danh sách pet trong cage
  
      await update(cageRef, { status: "Occupied", pets: updatedCagePets });
  
      const bookingRef = ref(db, `users/${userId}/bookings/${bookingId}`);
      const updatedBookingData = {
        ...booking,
        medicalRecord: {
          ...booking.medicalRecord,
          inCage: true,
        },
      };
      console.log("Updated Booking Data:", updatedBookingData); // Log thông tin booking sau khi cập nhật
  
      await update(bookingRef, updatedBookingData);
  
      toast.success("Assign pet to cage successfully!");
  
    } catch (error) {
      console.error("Error assigning cage to pending booking:", error);
      toast.error(`Error assigning cage: ${error.message}`);
    }
  };
  
  const handleConfirmAddPet = async () => {
    if (!bookingIdInput || !usernameInput) {
      toast.error("Please enter both booking ID and username");
      return;
    }
  
    try {
      const bookingId = bookingIdInput.trim();
      const username = usernameInput.trim();
      if (availableCages.length === 0) {
        toast.error("No available cages");
        return;
      }
  
      const selectedCage = availableCages[0];
      console.log("Selected Cage:", selectedCage.key); // Log cage được chọn
  
      await addPetToCage(bookingId, selectedCage.key, username);
      closeModal();
    } catch (error) {
      console.error("Error adding pet to cage:", error);
      toast.error("Error adding pet to cage. Please try again.");
    }
  };
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingIdInput, setBookingIdInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [availableCages, setAvailableCages] = useState([]);
  const [selectedCage, setSelectedCage] = useState(null);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  useEffect(() => {
    const fetchCages = async () => {
      try {
        const db = getDatabase();
        const cageRef = ref(db, "cages");
        const snapshot = await get(cageRef);
        const data = snapshot.val();
        const availableCages = Object.entries(data)
          .filter(([key, cage]) => cage.status === "Available")
          .map(([key, cage]) => ({ key, ...cage }));
        setAvailableCages(availableCages);
        console.log("Available cages:", availableCages);
        if (availableCages.length > 0) {
          setSelectedCage(availableCages[0]);
        }
      } catch (error) {
        console.error("Error fetching cages:", error);
      }
    };
  
    fetchCages();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cagesData = await getCages();
        // console.log(cagesData);

        if (cagesData) {
          const cageList = Object.keys(cagesData).map((key) => ({
            key: key, // store the key here
            ...cagesData[key],
          }));
          setCages(cageList);
        }

        const userData = await getAllUsers();

        if (userData) {
          const vetList = Object.keys(userData)
            .filter((key) => userData[key].role === "veterinarian")
            .map((key) => ({
              id: key,
              fullname: userData[key].fullname,
            }));
          setVets(vetList);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleVetChange = (cageKey, vet) => {
    setSelectedVets((prevSelectedVets) => ({
      ...prevSelectedVets,
      [cageKey]: vet,
    }));
  };

  const handleUpdate = async (cageKey, vetId) => {
    const vet = selectedVets[vetId];
    if (!vet) {
      console.error(`No veterinarian found for id: ${vetId}`);
      return;
    }

    const cageData = await getCageByKey(cageKey);
    if (!cageData) {
      console.error(`No cage found with key: ${cageKey}`);
      return;
    }
    console.log("Current Cage Data:", cageData);

    const updatedPets = cageData.pets.map((pet) => {
      if (pet.inCage) {
        return {
          ...pet,
          veterinarian: { id: vet.id, fullname: vet.fullname },
        };
      }
      return pet;
    });
    const updatedCageData = { ...cageData, pets: updatedPets };
    await updateCageByKey(cageKey, updatedCageData)
      .then(() => {
        console.log(`Cage ${cageKey} updated successfully.`);
      })
      .catch((error) => {
        console.error(`Error updating cage ${cageKey}:`, error);
      });
  };

  const handleRelease = async (cageKey) => {
    try {
      const cageData = await getCageByKey(cageKey);

      if (cageData) {
        const pets = cageData.pets || [];

        // Find the pet that is currently in the cage
        const petIndex = pets.findIndex((pet) => pet.inCage);
        if (petIndex !== -1) {
          pets[petIndex].inCage = false; // Set inCage to false

          const updatedCageData = { ...cageData, pets, status: "Available" };

          await updateCageByKey(cageKey, updatedCageData);
          console.log(`Cage ${cageKey} released successfully.`);
        } else {
          console.error("No pet currently in the cage.");
        }
      }
    } catch (error) {
      console.error(`Error releasing cage ${cageKey}:`, error);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: (
        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
          Cage ID
        </Typography>
      ),
      width: 150,
      editable: false,
      renderCell: ({ value }) => (
        <div style={{ fontSize: "16px" }}>{value}</div>
      ),
    },
    {
      field: "name",
      headerName: (
        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
          Cage name
        </Typography>
      ),
      flex: 0.5,
      editable: false,
      width: 150,
      renderCell: ({ value }) => (
        <div style={{ fontSize: "16px" }}>{value}</div>
      ),
    },
    {
      field: "bookingId",
      headerName: (
        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
          BookingID
        </Typography>
      ),
      flex: 0.5,
      editable: false,
      width: 150,
      renderCell: ({ row }) =>
        (row.pets || [])
          .filter((pet) => pet.inCage)
          .map((pet) => (
            <div key={pet.petId} style={{ fontSize: "16px" }}>
              {pet?.bookingId}
            </div>
          )),
    },
    {
      field: "status",
      headerName: (
        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
          Status
        </Typography>
      ),
      flex: 0.5,
      editable: false,
      renderCell: ({ value }) => (
        <div style={{ fontSize: "16px" }}>{value}</div>
      ),
    },
    {
      field: "veterinarian",
      headerName: (
        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>Vet</Typography>
      ),
      flex: 0.7,
      editable: true,
      renderCell: ({ row }) => {
        const vet =
          row.pets && row.pets.find((pet) => pet.inCage)?.veterinarian;
        return (
          <div style={{ fontSize: "16px" }}>
            {vet ? vet.fullname : "No Vet Assigned"}
          </div>
        );
      },
      renderEditCell: (params) => (
        <Typography sx={{ ml: "5px", fontSize: "20px" }}>
          <RoleEditCell
            {...params}
            vets={vets}
            handleVetChange={handleVetChange}
          />
        </Typography>
      ),
    },
    {
      field: "pets",
      headerName: (
        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>Pet</Typography>
      ),
      flex: 0.7,
      editable: false,
      renderCell: ({ value }) =>
        (value || [])
          .filter((pet) => pet.inCage)
          .map((pet) => (
            <div key={pet.petId} style={{ fontSize: "16px" }}>
              {pet.petId}
            </div>
          )),
    },
    {
      field: "update",
      headerName: (
        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
          Update
        </Typography>
      ),
      flex: 0.6,

      renderCell: (params) => {
        const hasPetInCage = params.row.pets?.some((pet) => pet.inCage);
        const hasVetAssigned = params.row.pets?.some((pet) => pet.veterinarian);
        return (
          <div className="admin-update-button">
            <Button
              variant="contained"
              size="small"
              onClick={() => handleUpdate(params.row.key, params.row.id)}
              style={{
                marginRight: "16px",
                fontSize: "16px",
                backgroundColor: "green",
              }}
            >
              Update
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleRelease(params.row.key)}
              style={{
                marginLeft: "16px",
                fontSize: "16px",
                backgroundColor: "green",
              }}
              disabled={!(hasPetInCage && hasVetAssigned)}
            >
              Release
            </Button>
          </div>
        );
      },
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

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const displayedRows = filteredCages.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Box m="20px">
      <Header title="CAGES" subtitle="Managing Cages for pets" />
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
        width={300}
        >
        <InputBase
          sx={{ ml: 2, flex: 1, fontSize: "20px" }}
          placeholder="Search by Cage ID or Name"
          value={searchQuery}
          onChange={handleSearch}
        />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon sx={{ fontSize: "20px" }} />
        </IconButton>
      </Box>
                  <Button
              variant="contained"
              size="small"
              style={{
                marginRight: "16px",
                fontSize: "16px",
                backgroundColor: "green",
              }}
              onClick={openModal}
            >
              Add
            </Button>
      
      <Box
        m="40px 0 0 0"
        height="40vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            display: "none",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiSvgIcon-root": {
            fontSize: "20px",
          },
          "& .MuiSelect-select": {
            fontSize: "18px",
            marginRight: "60px",
            paddingRight: "20px",
          },
          "& .MuiInputBase-root": {
            width: "209px",
          },
          "& .MuiDataGrid-overlay": {
            fontSize: "18px",
          },
        }}
      >
        <DataGrid rows={displayedRows} columns={columns} pagination={false} />
      </Box>
      <Box
        mt="20px"
        display="flex"
        justifyContent="center"
        sx={{
          "& .MuiPagination-root": {
            backgroundColor: colors.primary[400],
            borderRadius: "4px",
            padding: "10px",
          },
          "& .MuiPaginationItem-root": {
            fontSize: "1.2rem",
          },
        }}
      >
        <Pagination
          count={Math.ceil(filteredCages.length / rowsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {isModalOpen && (
  <div className="modal-overlay modal-overlay-otp" onClick={closeModal}>
    <div className="modal-content modal-content-otp" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3 style={{ fontSize: "22px", color: "#007bff" }}>Enter Booking ID and Username</h3>
        <span className="modal-close" onClick={closeModal}>
          &times;
        </span>
      </div>
      <div style={{ padding: "20px" }}>
        <input
          type="text"
          placeholder="Booking ID"
          value={bookingIdInput}
          onChange={(e) => setBookingIdInput(e.target.value)}
          style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #000" }}
        />
        <input
          type="text"
          placeholder="Username"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          style={{ width: "100%", padding: "10px", fontSize: "16px", border: "1px solid #000", marginTop: "10px" }}
        />
      </div>
      <div style={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
        <button onClick={handleConfirmAddPet}>Confirm</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  </div>
)}
    </Box>
  );
};

export default Cage;
