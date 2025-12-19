const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser');

dotenv.config();
console.log('✅ Environment variables loaded.');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('✅ Middleware loaded.');

// Load routes safely
try {
  const postRoutes = require('./routes/postRoutes');
  const authRoutes = require('./routes/authRoutes');
  const categoryRoutes = require('./routes/categoryRoutes');
  const authorRoutes = require('./routes/authorRoutes');
  app.use('/api/posts', postRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/authors', authorRoutes);
  console.log('✅ Routes loaded.');
} catch (err) {
  console.error('❌ Failed to load routes:', err.message);
}

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
