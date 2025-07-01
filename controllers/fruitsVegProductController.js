const Product = require("../models/FruitsVegProduct");

exports.getAll = async (req, res) => {
  const { tag, subcategoryId } = req.query;
  const filter = {};
  if (tag) filter.tag = tag;
  if (subcategoryId) filter.subcategoryId = subcategoryId;

  const data = await Product.find(filter).populate("subcategoryId");
  res.json(data);
};

exports.create = async (req, res) => {
  const images = req.files?.map((f) => f.filename) || [];
  const created = await Product.create({ ...req.body, images });
  res.status(201).json(created);
};

exports.update = async (req, res) => {
   const image = req.file?.filename || "";
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body,image, {
    new: true,
  });
  res.json(updated);
};

exports.remove = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

exports.getBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    console.log("Fetching products for subcategory:", subcategoryId);
    const products = await Product.find({ subcategoryId }).populate(
      "subcategoryId"
    );
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this subcategory" });
    }
    res.json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
