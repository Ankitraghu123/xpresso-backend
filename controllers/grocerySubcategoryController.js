const Subcategory = require("../models/GrocerySubCategory");

exports.getByCategory = async (req, res) => {
  const subs = await Subcategory.find({ categoryId: req.params.categoryId });
  res.json(subs);
};

exports.create = async (req, res) => {
  const { name, categoryId } = req.body;
  const image = req.file ? req.file.filename : null;
  const subcategory = new Subcategory({ name, categoryId, image });
  await subcategory.save();
  res.status(201).json(subcategory);
};

exports.getAll = async (req, res) => {
  try {
    const subcategories = await Subcategory.find();
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
};

exports.update = async (req, res) => {
  const data = req.body;
  if (req.file) data.image = req.file.filename;
  const sub = await Subcategory.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });
  res.json(sub);
};

exports.remove = async (req, res) =>
  res.json(await Subcategory.findByIdAndDelete(req.params.id));
