const express = require('express');
const { getServices, getVets, getAllBookings } = require('../controllers/allBookingDataController');
const router = express.Router();

router.get('/services', getServices);
router.get('/vets', getVets);
router.get('/bookings', getAllBookings);
module.exports = router;

