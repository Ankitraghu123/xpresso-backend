const express = require("express");
const {
  createPlan,
  getPlans,
  deletePlan,
} = require("../controllers/createPlan");
const { updatePlan } = require("../controllers/plan.controller");
const router = express.Router();
router.post("/create", createPlan); // POST /plans
router.get("/all", getPlans); // GET /plans
router.delete("/:id", deletePlan); // DELETE /api/plans/:id
router.put("/:id", updatePlan); // PUT /api/plans/:id

module.exports = router;
