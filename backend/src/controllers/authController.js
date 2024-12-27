import authService from '../services/authService.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.json({ status: 'success', token });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ status: 'success', user });
  } catch (error) {
    next(error);
  }
};
