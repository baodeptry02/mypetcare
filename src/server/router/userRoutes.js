

// routes/userRoutes.js
const express = require('express');
const multer = require('multer');
const { getUserById, updateUserById, uploadAvatar } = require('../controllers/userController');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/:userId', getUserById);
router.put('/:userId', updateUserById);
router.post('/:userId/avatar', upload.single('avatar'), uploadAvatar);

module.exports = router;

