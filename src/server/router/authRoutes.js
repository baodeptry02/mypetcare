// routes/authRoutes.js

const express = require("express");
const { googleLogin, registerUser, emailLogin } = require("../controllers/authController");
const router = express.Router();

router.post("/google-login", googleLogin);
router.post('/register', registerUser);
router.post('/email-login', emailLogin);

module.exports = router;
