import { login, register } from '../services/authService.js';

export const loginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await login(username, password);
    res.json({ status: 'success', token });
  } catch (error) {
    next(error);
  }
};

export const registerController = async (req, res, next) => {
  try {
    const user = await register(req.body.username, req.body.email, req.body.password, req.body.role);
    res.status(201).json({ status: 'success', user });
  } catch (error) {
    next(error);
  }
};
