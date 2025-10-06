const ErrorRes = require("../utilities/errorRes");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const authorization = async (req, res, next) => {
  //bypass db
  // return next();
  let token;
  req.headers.authorization?.startsWith("Bearer") &&
    (token = req.headers.authorization.split(" ")[1]);

  if (!token) {
    return next(
      new ErrorRes("You are not authorized to access this content", 401)
    );
  }

  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return next(new ErrorRes("Could not find a user with this id", 404));
    }
    if (req.params.id && user.id !== req.params.id) {
      return next(
        new ErrorRes("You are not authorized to access this content", 401)
      );
    }
    req.user = user;
    next();
  } catch (error) {
    return next(
      new ErrorRes("You are not authorized to access this content", 401)
    );
  }
};

module.exports = authorization;
