const Consultation = require('../models/Consultation');

exports.scheduleConsultation = async (userId, consultantId, date, details) => {
  return await Consultation.scheduleConsultation(userId, consultantId, date, details);
};

exports.getConsultationsByUser = async (userId) => {
  return await Consultation.getConsultationsByUser(userId);
};
