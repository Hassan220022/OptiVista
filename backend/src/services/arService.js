import { createSession, getSessionsByUser } from '../models/ARSession.js';

export const createARSession = async (userId, productId, snapshots, sessionMetadata) => {
  return await createSession(userId, productId, snapshots, sessionMetadata);
};

export const getARSessionsByUser = async (userId) => {
  return await getSessionsByUser(userId);
};