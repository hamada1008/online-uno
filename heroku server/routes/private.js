const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const privateController = require("../controllers/private");
router.use(authorization);
router.route("/").get(privateController);

module.exports = router;
