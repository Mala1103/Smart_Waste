const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cv = require('opencv4nodejs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/waste', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Define User model (make sure this matches your schema)
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

// Signin endpoint
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
const VOLUME_BENCHMARK = 1.5; // Benchmark for daily average volume in liters

function estimateWetWasteVolume(imagePath) {
  const src = cv.imread(imagePath);
  if (!src) {
    throw new Error("Image not found or unable to read the image.");
  }
  const gray = src.cvtColor(cv.COLOR_BGR2GRAY);
  const thresh = gray.threshold(120, 255, cv.THRESH_BINARY);
  const contours = thresh.findContours(cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  if (contours.length === 0) {
    return 0;
  }
  const maxContour = contours.sort((c0, c1) => c1.area - c0.area)[0];
  let volume = maxContour.area;
  volume = volume * 0.01; // Conversion factor
  return volume;
}

function calculateReward(volume) {
  let points = 0;
  if (volume < VOLUME_BENCHMARK) {
    points = 80;
  } else if (volume === VOLUME_BENCHMARK) {
    points = 50;
  } else {
    points = 0;
  }
  return points;
}

app.post('/analyze_waste', upload.single('image'), (req, res) => {
  try {
    const imagePath = req.file.path;
    const volume = estimateWetWasteVolume(imagePath);
    const points = calculateReward(volume);
    fs.unlinkSync(imagePath); // Cleanup uploaded image after processing
    res.json({ volume: volume, points: points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
