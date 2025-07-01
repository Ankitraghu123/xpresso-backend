const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const {
  createMilkProduct,
  getAllMilkProducts,
  getMilkProductById,
  getByCategoryId,
  updateMilkProduct,
  deleteMilkProduct,
} = require("../controllers/milkProduct.controller");

// Routes
router.post("/create", upload.single("image"), createMilkProduct);
router.get("/", getAllMilkProducts);
router.get("/:id", getMilkProductById);
router.get("/category/:categoryId", getByCategoryId);
router.put("/:id", upload.single("image"), updateMilkProduct);
router.delete("/:id", deleteMilkProduct);

module.exports = router;
