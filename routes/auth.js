const express = require("express");
const router = express.Router();
const { loginController, registerController } = require("../controllers/auth");
router.route("/register").post(registerController);

router.route("/login").post(loginController);

module.exports = router;
