const businessService = require('../services/businessService');

const createMyBusinessProfile = async (req, res, next) => {
  try {
    const businessProfile = await businessService.createBusinessProfile(req.user.id, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Business profile created successfully',
      data: {
        businessProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMyBusinessProfile = async (req, res, next) => {
  try {
    const businessProfile = await businessService.getMyBusinessProfile(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        businessProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateMyBusinessProfile = async (req, res, next) => {
  try {
    const businessProfile = await businessService.updateBusinessProfile(req.user.id, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Business profile updated successfully',
      data: {
        businessProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

const listBusinessProfiles = async (req, res, next) => {
  try {
    const businessProfiles = await businessService.listActiveBusinessProfiles();

    res.status(200).json({
      status: 'success',
      data: {
        businessProfiles
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMyBusinessProfile,
  getMyBusinessProfile,
  listBusinessProfiles,
  updateMyBusinessProfile
};
