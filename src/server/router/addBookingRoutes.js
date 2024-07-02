
const express = require('express');
const { addBooking, updateAccountBalance, updateVetSchedule } = require("../controllers/addBookingController");
const router = express.Router();

router.post('/booking', addBooking);
router.post('/account-balance', updateAccountBalance);
router.post('/vet-schedule', updateVetSchedule);

module.exports = router;
