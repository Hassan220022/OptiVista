export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ success: false, message });
};

export const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
};
