import { scheduleConsultationService, getConsultationsByUserService } from '../services/consultationService.js';

export const scheduleConsultation = async (req, res) => {
  const { userId, consultantId, date, details } = req.body;
  try {
    const consultationId = await scheduleConsultationService(userId, consultantId, date, details);
    res.json({ success: true, consultationId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConsultationsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const consultations = await getConsultationsByUserService(userId);
    res.json({ success: true, consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};