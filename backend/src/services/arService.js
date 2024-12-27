const ARSession = require('../models/ARSession');

exports.createSession = async (userId, productId, snapshots, sessionMetadata) => {
  return await ARSession.createSession(userId, productId, snapshots, sessionMetadata);
};

exports.getSessionsByUser = async (userId) => {
  return await ARSession.getSessionsByUser(userId);
};
