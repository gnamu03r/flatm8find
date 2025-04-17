require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const imageRoutes = require('./routes/imageRoutes'); // still using this, in case other routes exist

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
  }));
app.use(express.json());

// Cloudinary config (needed if not handled elsewhere)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Logs to verify Cloudinary is properly configured
console.log('✅ Cloudinary Credentials Loaded:');
console.log('🌥️ Cloud Name:', process.env.CLOUD_NAME);
console.log('🔑 API Key:', process.env.CLOUDINARY_API_KEY);
// console.log('🕵️‍♂️ API Secret:', process.env.CLOUDINARY_API_SECRET); // optional to hide
console.log("✅ Mounted route: /api/images/delete-multiple");


// Routes from separate file (if they exist)
app.use('/api/images', imageRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
