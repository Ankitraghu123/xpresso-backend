// routes/milkCategoryRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/milkCategoryController");
const upload = require("../config/multer");

router.post("/create", upload.single("image"), controller.createMilkCategory);
router.get("/", controller.getAllMilkCategories);
router.get("/:id", controller.getMilkCategoryById);
router.put("/:id", upload.single("logo"), controller.updateMilkCategory);
router.delete("/:id", controller.deleteMilkCategory);
router.get("/category/:categoryId", controller.getProductsByMilkCategoryId);

module.exports = router;
