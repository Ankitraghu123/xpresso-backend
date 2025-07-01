const Product = require("../models/GroceryProduct");

// Create
exports.create = async (req, res) => {
  try {
    const { name, price, brand, stock, unit, description, subcategoryId } =
      req.body;
    const image = req.file ? req.file.filename : null;
    const product = new Product({
      name,
      price,
      brand,
      stock,
      unit,
      description,
      image,
      subcategoryId,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create product", details: err.message });
  }
};

// Get all
exports.getAll = async (req, res) => {
  try {
    const products = await Product.find().populate("subcategoryId");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get by subcategory
exports.getBySubcategory = async (req, res) => {
  try {
    const products = await Product.find({
      subcategoryId: req.params.subcategoryId,
    });
    console.log("Products by subcategory:", products, req.params.subcategoryId);
    console.log("Products count:", products);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products by subcategory" });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.filename;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(product);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update product", details: err.message });
  }
};

// Delete
exports.remove = async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
