require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errorHandler, notFound } = require('./src/middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/ar', require('./src/routes/arRoutes'));
app.use('/api/consultations', require('./src/routes/consultationRoutes'));
app.use('/api/feedback', require('./src/routes/feedbackRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/upload', require('./src/routes/uploadRoutes'));

// Global error handling and 404 handler
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
