const milkProduct = require("../models/milkProduct");

exports.createMilkProduct = async (req, res) => {
  try {
    const { name, quantity, unit, price, categoryId } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = new milkProduct({
      name,
      image,
      quantity,
      unit,
      price,
      categoryId,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllMilkProducts = async (req, res) => {
  try {
    const products = await milkProduct.find().populate("categoryId");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMilkProductById = async (req, res) => {
  try {
    const product = await milkProduct
      .findById(req.params.id)
      .populate("categoryId");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCategoryId = async (req, res) => {
  try {
    const products = await milkProduct.find({
      categoryId: req.params.categoryId,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMilkProduct = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.path;
    const updated = await milkProduct.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMilkProduct = async (req, res) => {
  try {
    await milkProduct.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
