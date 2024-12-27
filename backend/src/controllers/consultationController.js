const Consultation = require('../models/Consultation');

exports.scheduleConsultation = async (req, res) => {
  const { userId, consultantId, date, details } = req.body;
  try {
    const consultationId = await Consultation.scheduleConsultation(userId, consultantId, date, details);
    res.json({ success: true, consultationId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConsultationsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const consultations = await Consultation.getConsultationsByUser(userId);
    res.json({ success: true, consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
