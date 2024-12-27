const ARSession = require('../models/ARSession');

exports.createSession = async (req, res) => {
  const { userId, productId, snapshots, sessionMetadata } = req.body;
  try {
    const sessionId = await ARSession.createSession(userId, productId, snapshots, sessionMetadata);
    res.json({ success: true, sessionId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSessionsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const sessions = await ARSession.getSessionsByUser(userId);
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
