const express = require("express");
const {
  getAll,
  create,
  update,
  remove,
  getCategoriesWithSubcategories,
} = require("../controllers/groceryCategoryController");
const router = express.Router();

router.get("/", getAll);
router.post("/create", create);
router.put("/:id", update);
router.delete("/:id", remove);
router.get("/with-subcategories", getCategoriesWithSubcategories);

module.exports = router;
