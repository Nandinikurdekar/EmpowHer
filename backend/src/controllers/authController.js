const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register
};
