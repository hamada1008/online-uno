const express = require("express");
const router = express.Router();
const {
  loginController,
  registerController,
  authorization,
} = require("../controllers/auth");
router.route("/register").post(registerController);

router.route("/login").post(loginController);

router.route("/authorization").get(authorization);

module.exports = router;
