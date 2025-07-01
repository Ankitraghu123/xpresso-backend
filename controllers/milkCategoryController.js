const fs = require("fs");
const MilkCategory = require("../models/MilkCategory");
const milkProduct = require("../models/MilkProduct");

exports.getProductsByMilkCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await milkProduct.find({ categoryId });

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
exports.createMilkCategory = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const milkCategory = new MilkCategory({
      name: req.body.name,
      address: req.body.address,
      image: req.file.filename,
      rating: req.body.rating || 0,
    });

    await milkCategory.save();
    res.status(201).json(milkCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
exports.getAllMilkCategories = async (req, res) => {
  try {
    const categories = await MilkCategory.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
exports.getMilkCategoryById = async (req, res) => {
  try {
    const category = await MilkCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateMilkCategory = async (req, res) => {
  try {
    const category = await MilkCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });

    if (req.file) {
      if (category.logo) fs.unlinkSync(category.logo);
      category.logo = req.file.path;
    }

    category.name = req.body.name || category.name;
    category.address = req.body.address || category.address;
    category.rating = req.body.rating || category.rating;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteMilkCategory = async (req, res) => {
  try {
    const category = await MilkCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });

    if (category.logo) fs.unlinkSync(category.logo);
    await MilkCategory.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
