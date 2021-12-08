const User = require("../model/user");
const ErrorRes = require("../utilities/errorRes");
const jwt = require("jsonwebtoken");

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
    next(new ErrorRes("Please Fill in the form fields", 400));
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
    next(new ErrorRes(error.message, 400));
  }
};
exports.authorization = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    next(new ErrorRes("You are not authorized to access this content", 401));
  }
  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      next(new ErrorRes("Could not find a user with this is", 404));
    }
    res.status(200).json({ success: true, msg: "authorized" });
  } catch (error) {
    next(new ErrorRes("You are not authorized to access this content", 401));
  }
};
