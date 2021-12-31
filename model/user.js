const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already taken"],
    required: [true, "Please enter a valid username"],
    minlength: [2, `Your username should be more than 2 characters`],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already taken"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 6,
    select: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
  },
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getJwtToken = function () {
  const id = this._id;
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
UserSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
