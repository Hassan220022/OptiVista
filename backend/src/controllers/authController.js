const authService = require('../services/authService');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authService.login(email, password);
    res.json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const user = await authService.register(username, email, password, role);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
