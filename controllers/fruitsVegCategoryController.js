const Category = require("../models/FruitsVegCategory");
const Subcategory = require("../models/FruitsVegSubcategory");

exports.getAll = async (req, res) => {
  const data = await Category.find();
  res.json(data);
};

exports.create = async (req, res) => {
  const created = await Category.create(req.body);
  res.status(201).json(created);
};

exports.update = async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

exports.remove = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

exports.getCategoriesWithSubcategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    const result = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await Subcategory.find({
          categoryId: category._id,
        });

        return {
          ...category,
          subcategories,
        };
      })
    );

    res.status(200).json(result);
  } catch (err) {
    console.error(
      "❌ Failed to fetch Fruits & Veg categories with subcategories",
      err
    );
    res.status(500).json({ message: "Server error" });
  }
};
