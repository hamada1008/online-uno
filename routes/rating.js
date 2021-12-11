const express = require("express");
const router = express.Router();
const {
  getRatingController,
  updateRatingController,
} = require("../controllers/rating");
router.route("/users/:id/rating").get(getRatingController);
router.route("/users/:id/rating").put(updateRatingController);

module.exports = router;
