import { scheduleConsultation, getConsultationsByUser } from '../models/Consultation.js';

export const scheduleConsultationService = async (userId, productId, snapshots, sessionMetadata) => {
  return await scheduleConsultation(userId, productId, snapshots, sessionMetadata);
};

export const getConsultationsByUserService = async (userId) => {
  return await getConsultationsByUser(userId);
};