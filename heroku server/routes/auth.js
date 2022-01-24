const express = require("express");
const router = express.Router();
const {
  loginController,
  registerController,
  guestRegisterController,
  logoutGuestController,
} = require("../controllers/auth");
const authorization = require("../middleware/authorization");
router.route("/register").post(registerController);
router.route("/login").post(loginController);
router.route("/guest").get(guestRegisterController);
router.route("/guest-logout").delete(authorization, logoutGuestController);

module.exports = router;
