const User = require("../model/user");
const ErrorRes = require("../utilities/errorRes");

exports.registerController = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(200).json({ success: true, msg: user.getJwtToken() });
  } catch (error) {
    next(error);
  }
};
exports.loginController = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorRes("Please Fill in the form fields", 400));
  try {
    const user = await User.findOne({ email }).select("+password");
    const passwordsMatched = user && (await user.comparePasswords(password));
    if (passwordsMatched) {
      res.status(200).json({ success: true, msg: user.getJwtToken() });
    } else {
      next(
        new ErrorRes("Could not sign in, please verify your credentials", 401)
      );
    }
  } catch (error) {
    return next(new ErrorRes(error.message, 400));
  }
};
