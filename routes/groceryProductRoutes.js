const express = require("express");
const router = express.Router();
const productController = require("../controllers/groceryProductController");
const upload = require("../config/multer");

// CRUD Routes
router.post("/", upload.single("image"), productController.create);
router.get("/", productController.getAll);
router.get("/:subcategoryId", productController.getBySubcategory);
router.put("/:id", upload.single("image"), productController.update);
router.delete("/:id", productController.remove);

module.exports = router;
