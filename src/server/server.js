const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const port = 5000;

const userRoutes = require("./router/userRoutes");
const bookingRoutes = require("./router/bookingRoutes");
const cancelBookingRoutes = require("./router/cancelBookingRoutes");
require("dotenv").config();
const petRoutes = require('./router/petRoutes');
const authRoutes = require("./router/authRoutes");
const servicesRoutes = require("./router/allBookingDataRoutes");
const addBookingRoutes = require("./router/addBookingRoutes");
const transactionRoutes = require("./router/transactionRoutes");
const emailRoutes = require("./router/emailRoutes");
const service_cageRoutes = require("./router/service-cageRoutes");
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://mypetcare-center.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Setup static file serving
app.use(express.static('public'));

// Setup CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://mypetcare-center.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

// Setup Swagger
const setupSwagger = require('./swagger');
setupSwagger(app);

// Middleware to parse JSON requests
app.use(express.json());

// Use routes
app.use("/userData", userRoutes);
app.use('/bookings', bookingRoutes);
app.use('/cancel-booking', cancelBookingRoutes);
app.use('/pets', petRoutes);
app.use("/auth", authRoutes);
app.use("/allBookingData", servicesRoutes);
app.use("/addBookingData", addBookingRoutes);
app.use("/transaction", transactionRoutes);
app.use("/services_cages", service_cageRoutes);
app.use("/", emailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Setup Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Listen for messages from the client
  socket.on('someEvent', (data) => {
    console.log('Received data:', data);
    // Handle the event and possibly emit an update
    // io.emit('bookingUpdated', updateData);
  });
});

const generateNumericOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtpEmail = async ({ user_email }) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aqaq03122003@gmail.com',
        pass: 'lnaxqylhuaztmnwn',
      },
    });

    const otp = generateNumericOtp();
    const emailKey = user_email.split('@')[0];
    const db = admin.database();
    db.ref(`otp/${emailKey}`).set({
      otp,
      expires: Date.now() + 5 * 60 * 1000 // OTP expires in 5 minutes
    }, (error) => {
      if (error) {
        return reject({ message: `An error occurred while setting OTP: ${error.message}` });
      }

      const mail_configs = {
        from: 'aqaq03122003@gmail.com',
        to: user_email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
      };

      transporter.sendMail(mail_configs, (error, info) => {
        if (error) {
          return reject({ message: `An error occurred: ${error.message}` });
        }
        return resolve({ message: 'OTP email sent successfully' });
      });
    });
  });
};

app.post('/send-otp-email', async (req, res) => {
  const { user_email } = req.body;

  if (!user_email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await sendOtpEmail({ user_email });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const verifyOtp = async (user_email, otp) => {
  const emailKey = user_email.split('@')[0];
  const db = admin.database();
  
  return new Promise((resolve, reject) => {
    db.ref(`otp/${emailKey}`).once('value', (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const { otp: storedOtp, expires } = data;
        
        if (Date.now() > expires) {
          return reject({ message: 'OTP has expired' });
        }
        
        if (storedOtp === otp) {
          return resolve({ message: 'OTP verified successfully' });
        } else {
          return reject({ message: 'Invalid OTP' });
        }
      } else {
        return reject({ message: 'No OTP found for this email' });
      }
    });
  });
};

app.post('/verify-otp', async (req, res) => {
  const { user_email, otp } = req.body;

  if (!user_email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const response = await verifyOtp(user_email, otp);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

server.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
});
