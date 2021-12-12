const privateController = (req, res, next) => {
  res
    .status(200)
    .json({
      success: true,
      msg: { id: req.user.id, username: req.user.username },
    });
};
module.exports = privateController;
