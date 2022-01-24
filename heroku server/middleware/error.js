const ErrorRes = require("../utilities/errorRes");
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.code === 11000) {
    const msg = "User already exists, Username & Email must be unique";
    error = new ErrorRes(msg, 400);
  }

  if (err.name === "ValidationError") {
    if (err.errors.password) {
      var msg = "Password should be longer than 6 characters";
    } else {
      var msg = Object.values(err.errors).map((val) => val.message);
    }
    error = new ErrorRes(msg, 400);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    msg: error.message || "Server Error",
  });
};

module.exports = errorHandler;
