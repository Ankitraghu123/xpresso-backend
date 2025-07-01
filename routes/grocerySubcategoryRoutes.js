const express = require("express");
const router = express.Router();
const controller = require("../controllers/grocerySubcategoryController");
const upload = require("../config/multer");

router.get("/category/:categoryId", controller.getByCategory);
router.post("/create", upload.single("image"), controller.create);
router.put("/:id", upload.single("image"), controller.update);
router.delete("/:id", controller.remove);
router.get("/", controller.getAll);

module.exports = router;
