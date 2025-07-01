const GroceryCategory = require("../models/GroceryCategory");
const GrocerySubCategory = require("../models/GrocerySubCategory");
const slugify = require("slugify");
exports.getAll = async (req, res) => res.json(await GroceryCategory.find());

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    // Generate a slug from the name
    const slug = slugify(name, { lower: true });

    const category = new GroceryCategory({ ...req.body, slug });
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create category error:", err);
    if (err.code === 11000) {
      res.status(400).json({ error: "Category with this name or slug already exists" });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};

exports.update = async (req, res) =>
  res.json(
    await GroceryCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
  );
exports.remove = async (req, res) =>
  res.json(await GroceryCategory.findByIdAndDelete(req.params.id));

exports.getCategoriesWithSubcategories = async (req, res) => {
  try {
    const categories = await GroceryCategory.find();

    const result = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await GrocerySubCategory.find({
          categoryId: category._id,
        });
        return {
          ...category.toObject(),
          subcategories,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
