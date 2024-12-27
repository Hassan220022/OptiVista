// Generic error handler
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({ success: false, message });
  };
  
  // Not Found middleware
  export const notFound = (req, res, next) => {
    res.status(404).json({ success: false, message: 'Resource not found' });
  };

  


//////////////////
//////Usage Example:
/////////Add these middlewares to your main server file (index.js) for global handling:

// const express = require('express');
// const { errorHandler, notFound } = require('./middlewares/errorHandler');

// const app = express();

// // Define routes
// app.use('/api', apiRoutes);

// // Handle 404 (Not Found)
// app.use(notFound);

// // Handle other errors
// app.use(errorHandler);

// app.listen(3000, () => console.log('Server running on port 3000'));
