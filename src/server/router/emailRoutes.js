const express = require("express");
const router = express.Router();
const { sendEmailHandler, sendCancellationEmailHandler, sendUpdatePasswordEmail } = require("../controllers/emailController");

router.post("/send-email", sendEmailHandler);
router.post("/send-cancellation-email", sendCancellationEmailHandler);
router.post("/send-updatePassword-email", sendUpdatePasswordEmail);

module.exports = router;
