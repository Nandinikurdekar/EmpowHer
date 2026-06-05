const profileService = require('../services/profileService');

const createMyProfile = async (req, res, next) => {
  try {
    const profile = await profileService.createProfile(req.user.id, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Entrepreneur profile created successfully',
      data: {
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Entrepreneur profile updated successfully',
      data: {
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMyProfile,
  getMyProfile,
  updateMyProfile
};
