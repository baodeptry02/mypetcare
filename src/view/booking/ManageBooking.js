import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update, get } from "firebase/database";
import { auth } from "../../Components/firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { Pagination, PaginationItem } from "@mui/material";
import { makeStyles } from "@mui/styles"; // Import makeStyles

const useStyles = makeStyles({
  pagination: {
    display: "flex",
    justifyContent: "center",
    fontSize: "1.5rem",
    marginTop: "3rem",
    paddingBottom: "2rem",
    "& .MuiPaginationItem-root": {
      fontSize: "1.5rem",
      marginLeft: "2rem",
      padding: "4px",
      borderRadius: "50%",
      backgroundColor: "#1976d2",
      color: "#fff",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#f0f0f0",
        borderColor: "#999",
        color: "#000",
      },
    },
  },
});

const ManageBookings = () => {
  const [paidBookings, setPaidBookings] = useState([]);
  const [unpaidBookings, setUnpaidBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [showPaid, setShowPaid] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  const navigate = useNavigate(); // Initialize navigate
  const classes = useStyles();

  useEffect(() => {
    if (!user) {
      console.log("No user is currently logged in.");
      return;
    }

    const db = getDatabase();
    const bookingRef = ref(db, `users/${user.uid}/bookings`);
    const unsubscribe = onValue(bookingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const paid = [];
        const unpaid = [];
        Object.keys(data).forEach((key) => {
          const booking = { ...data[key], key }; // Add the key to the booking object for updating later
          if (booking.paid) {
            paid.push(booking);
          } else {
            unpaid.push(booking);
          }
        });
        // Sort paid bookings with pending at top and cancelled at bottom
        paid.sort((a, b) => (a.status === "cancelled" ? 1 : -1));
        setPaidBookings(paid);
        setUnpaidBookings(unpaid);
      } else {
        setPaidBookings([]);
        setUnpaidBookings([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCancel = (booking) => {
    setConfirmCancel(booking);
  };

  const confirmCancellation = async () => {
    if (confirmCancel) {
      const user = auth.currentUser;
      const db = getDatabase();
      const bookingRef = ref(
        db,
        `users/${user.uid}/bookings/${confirmCancel.key}`
      );

      try {
        const refundAmount = confirmCancel.totalPaid * 0.75;

        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        const updatedBalance = userData.accountBalance + refundAmount;

        await update(bookingRef, { status: "cancelled" });

        await update(userRef, { accountBalance: updatedBalance });

        const updatedPaidBookings = paidBookings.map((booking) => {
          if (booking.key === confirmCancel.key) {
            return { ...booking, status: "cancelled" };
          }
          return booking;
        });

        // Sort the updated list so cancelled bookings are at the bottom
        updatedPaidBookings.sort((a, b) => (a.status === "cancelled" ? 1 : -1));
        setPaidBookings(updatedPaidBookings);

        // Show success message
        toast.success("Booking cancelled. Refund processed successfully!");

        // Reset confirmCancel state
        setConfirmCancel(null);
      } catch (error) {
        console.error("Error cancelling booking:", error);
        toast.error("An error occurred while processing the cancellation.");
      }
    }
  };

  const toggleBookings = () => {
    setShowPaid(!showPaid);
  };

  const closeModal = () => {
    setConfirmCancel(null);
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentPaidBookings = paidBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const currentUnpaidBookings = unpaidBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  useEffect(() => {
    const applyStyles = () => {
      document.querySelectorAll('.MuiPaginationItem-root').forEach(item => {
        item.classList.add(classes.paginationItem);
      });
    };
    applyStyles();
  }, [currentPage, classes]);

  return (
    <div className="manage-bookings-page">
      <h2>Manage Bookings</h2>
      {showPaid ? (
        <div className="bookings-section">
          <h3>Paid Bookings</h3>
          {loading ? (
            <p>Loading paid bookings...</p>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                  <th>#</th>
                    <th>Booking ID</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th className="action">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPaidBookings.map((booking, index) => (
                    <tr
                      key={booking.key}
                      className={
                        booking.status === "cancelled"
                          ? "cancelled-booking"
                          : ""
                      }
                    >
                       <td>{indexOfFirstBooking + index + 1}</td>
                      <td>{booking.bookingId}</td>
                      <td>{booking.date}</td>
                      <td>{booking.time}</td>
                      <td>{booking.status || "pending"}</td>
                      <td>
                        <button
                          className="detail-button"
                          onClick={() =>
                            navigate(`/booking-details/${booking.key}`)
                          }
                        >
                          Show Details
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => handleCancel(booking)}
                          disabled={booking.status === "cancelled"}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {paidBookings.length > bookingsPerPage && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '1rem', marginTop: "2rem", fontSize: "2rem" }}>
                    Page {currentPage} of {Math.ceil(paidBookings.length / bookingsPerPage)}
                  </div>
                  <Pagination
                    count={Math.ceil(paidBookings.length / bookingsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    size="large"
                    className={classes.pagination}
                  />
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="bookings-section">
          <h3>Unpaid Bookings</h3>
          {loading ? (
            <p>Loading unpaid bookings...</p>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Booking ID</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Paid</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUnpaidBookings.map((booking, index) => (
                    <tr key={booking.key}>
                       <td>{indexOfFirstBooking + index + 1}</td>
                      <td>{booking.bookingId}</td>
                      <td>{booking.date}</td>
                      <td>{booking.time}</td>
                      <td>{booking.paid ? "True" : "False"}</td>
                      <td>
                        <button
                          className="detail-button"
                          onClick={() =>
                            navigate(`/booking-details/${booking.id}`)
                          }
                        >
                          Show Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {unpaidBookings.length > bookingsPerPage && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '1rem', marginTop: "2rem", fontSize: "2rem" }}>
                    Page {currentPage} of {Math.ceil(unpaidBookings.length / bookingsPerPage)}
                  </div>
                  <Pagination
                    count={Math.ceil(unpaidBookings.length / bookingsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    className={classes.pagination}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
      <ToastContainer autoClose={3000} />
      <div className="toggle-button">
        <button onClick={toggleBookings}>
          {showPaid ? "Show Unpaid Bookings" : "Show Paid Bookings"}
        </button>
      </div>
      {confirmCancel && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Cancellation</h3>
              <span className="modal-close" onClick={closeModal}>
                &times;
              </span>
            </div>
            <p
              style={{ fontSize: "2rem", padding: "12px", lineHeight: "3rem" }}
            >
              This booking will be cancelled and we will return you 75% amount
              of this booking
            </p>
            <div className="modal-actions">
              <button className="confirm" onClick={confirmCancellation}>
                Yes
              </button>
              <button className="cancel" onClick={closeModal}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
