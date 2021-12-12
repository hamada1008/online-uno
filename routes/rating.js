const express = require("express");
const router = express.Router();
const {
  getRatingController,
  updateRatingController,
} = require("../controllers/rating");
const authorization = require("../middleware/authorization");
router.route("/users/:id/rating").get(authorization, getRatingController);
router.route("/users/:id/rating").put(authorization, updateRatingController);

module.exports = router;
