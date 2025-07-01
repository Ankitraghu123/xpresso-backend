const express = require("express");
const {
  getAllSubscriptions,
  subscribeToPlan,
  getUserSubscription,
} = require("../controllers/subscription.controller");
const router = express.Router();

router.post("/create", subscribeToPlan); // POST /subscriptions
router.get("/:userId", getUserSubscription); // GET /subscriptions/:userId
router.get("/all", getAllSubscriptions); // GET /subscriptions/:userId

module.exports = router;
