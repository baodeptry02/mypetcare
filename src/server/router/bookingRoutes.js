// routes/bookingsRoutes.js
const express = require('express');
const { getBookingsByUserId, getBookingDetails, getServices } = require('../controllers/bookingController');
const router = express.Router();

router.get('/:userId', getBookingsByUserId);
router.get("/:userId/:bookingId", getBookingDetails);

module.exports = router;
