const express = require("express");
const router = express.Router();

const category = require("../controllers/fruitsVegCategoryController");
const subcategory = require("../controllers/fruitsVegSubcategoryController");
const product = require("../controllers/fruitsVegProductController");
const upload = require("../config/multer");

// 🥦 Category
router.get("/categories", category.getAll);
router.post("/categories", category.create);
router.put("/categories/:id", category.update);
router.delete("/categories/:id", category.remove);
router.get(
  "/categories/with-subcategories",
  category.getCategoriesWithSubcategories
);

// 🥕 Subcategory
router.get("/subcategories", subcategory.getAll);
router.post("/subcategories", upload.single("image"), subcategory.create);
router.put("/subcategories/:id", subcategory.update);
router.delete("/subcategories/:id", subcategory.remove);

// 🍎 Products
router.get("/products", product.getAll);
router.post("/products", upload.array("images", 2), product.create);
router.put("/products/:id", product.update);
router.delete("/products/:id", product.remove);
router.get("/products/subcategory/:subcategoryId", product.getBySubcategory);
module.exports = router;
