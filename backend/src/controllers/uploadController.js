const uploadService = require('../services/uploadService');
const config = require('../config/appConfig');

exports.uploadFile = async (req, res) => {
  const filePath = req.file.path;
  const objectName = req.file.originalname;

  try {
    const url = await uploadService.uploadFile(config.minioBucket, filePath, objectName);
    res.json({ success: true, url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
