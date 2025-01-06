import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler, notFound } from './src/middlewares/errorHandler.js';
import rateLimiter from './src/middlewares/rateLimiter.js';

import authRoutes from './src/routes/authRoutes.js';
import arRoutes from './src/routes/arRoutes.js';
import consultationRoutes from './src/routes/consultationRoutes.js';
import feedbackRoutes from './src/routes/feedbackRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';

const app = express();
app.use(express.json());

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ar', arRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Global error handling and 404 handler
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
