const planSchema = require("../models/planSchema");
const subscriptionSchema = require("../models/subscriptionSchema");

// @desc Subscribe user to a plan
exports.subscribeToPlan = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user from auth middleware
    const { planId } = req.body;

    const plan = await planSchema.findById(planId);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.durationInDays);

    const existing = await subscriptionSchema.findOne({ userId });
    if (existing) await existing.deleteOne(); // Replace old sub

    const subscription = await subscriptionSchema.create({
      userId,
      planId,
      startDate,
      endDate,
      isActive: true,
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get user's current subscription
exports.getUserSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await subscriptionSchema
      .findOne({ userId })
      .populate("planId")
      .lean();

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "No subscription found" });
    }

    res.json({ success: true, data: subscription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionSchema
      .find()
      .populate("userId", "name email") // only select fields needed
      .populate("planId")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: subscriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
