require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { pool, initDatabase, testConnection } = require('./config/db.config');
const { initBuckets } = require('./config/minio.config');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const uploadRoutes = require('./routes/upload.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security middleware
app.use(morgan('dev')); // Logging middleware
app.use(cors()); // CORS middleware
app.use(express.json()); // JSON parsing middleware
app.use(express.urlencoded({ extended: true })); // URL-encoded parsing middleware

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check routes
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'OptiVista API is running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'OptiVista API is running' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await testConnection();
    
    // Initialize database tables
    await initDatabase();
    
    // Try to initialize MinIO buckets, but continue if it fails
    try {
      await initBuckets();
    } catch (minioError) {
      console.warn('MinIO initialization failed, continuing without file storage:', minioError.message);
    }
    
    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`OptiVista API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app; 