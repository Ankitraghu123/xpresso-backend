const planSchema = require("../models/planSchema");

exports.createPlan = async (req, res) => {
  try {
    const plan = await planSchema.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await planSchema.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await planSchema.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json({ message: "Plan deleted successfully", plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
