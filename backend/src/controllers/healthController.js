const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'EmpowHer backend is running'
  });
};

module.exports = {
  getHealth
};
