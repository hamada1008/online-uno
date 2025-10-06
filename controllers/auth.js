const User = require("../model/user");
const ErrorRes = require("../utilities/errorRes");
const { v4: uuidv4 } = require("uuid");

exports.registerController = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.status(200).json({ success: true, msg: user.getJwtToken() });
  } catch (error) {
    next(error);
  }
};
exports.guestRegisterController = async (req, res, next) => {
  const guestUserName = "guest" + uuidv4();
  const guestEmail = `${uuidv4()}@demo.com`;
  const guestPassword = uuidv4();
  try {
    const user = await User.create({
      username: guestUserName,
      email: guestEmail,
      password: guestPassword,
    });
    res.status(200).json({ success: true, msg: user.getJwtToken() });
  } catch (error) {
    next(error);
  }
};

exports.logoutGuestController = async (req, res, next) => {
  const id = req.user.id;
  try {
    await User.findByIdAndDelete(id).exec();
    res
      .status(200)
      .json({ success: true, msg: "Guest user was removed from the database" });
  } catch (error) {
    next(error);
  }
};
exports.loginController = async (req, res, next) => {
  const { email, password } = req.body;
  //bypass db
  // return res.status(200).json({ success: true, msg: "ey1231123132" });
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
