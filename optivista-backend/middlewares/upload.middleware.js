/**
 * Middleware to validate file type by extension
 * @param {Array} allowedExtensions - Array of allowed file extensions (e.g., ['.jpg', '.png'])
 */
const validateFileType = (allowedExtensions) => {
  return (req, res, next) => {
    if (!req.files) {
      return next();
    }

    // Handle single file
    if (req.files.file) {
      const file = req.files.file;
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        return res.status(400).json({
          message: `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`
        });
      }
    }

    // Handle multiple files
    if (req.files.files) {
      const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

      for (const file of files) {
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        if (!allowedExtensions.includes(extension)) {
          return res.status(400).json({
            message: `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`
          });
        }
      }
    }

    next();
  };
};

/**
 * Middleware to validate file size
 * @param {Number} maxSize - Maximum file size in bytes
 */
const validateFileSize = (maxSize) => {
  return (req, res, next) => {
    if (!req.files) {
      return next();
    }

    // Handle single file
    if (req.files.file) {
      const file = req.files.file;

      if (file.size > maxSize) {
        return res.status(400).json({
          message: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
        });
      }
    }

    // Handle multiple files
    if (req.files.files) {
      const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

      for (const file of files) {
        if (file.size > maxSize) {
          return res.status(400).json({
            message: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
          });
        }
      }
    }

    next();
  };
};

/**
 * Middleware to validate image dimensions
 * This requires processing the image which can be added if needed
 */

module.exports = {
  validateFileType,
  validateFileSize
}; 