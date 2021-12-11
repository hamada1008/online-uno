const User = require("../model/user");
const ErrorRes = require("../utilities/errorRes");
exports.getRatingController = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id, "-_id rating");
    res.status(200).json({ success: true, msg: user.rating });
  } catch (error) {
    return next(new ErrorRes(`Could not fetch this user's rating`, 404));
  }
};
exports.updateRatingController = async (req, res, next) => {
  const { gameRating } = req.body;
  if (!gameRating) {
    return next(new ErrorRes(`Could not update this user's rating`, 400));
  }
  try {
    const user = await User.findById(req.params.id, "rating");
    user.rating = user.rating + gameRating;
    await user.save();
    res
      .status(200)
      .json({ success: true, msg: "User rating updated successfully" });
  } catch (error) {
    return next(new ErrorRes(`Could not update this user's rating`, 404));
  }
};
