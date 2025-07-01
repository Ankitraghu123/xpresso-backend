const Subcategory = require("../models/FruitsVegSubcategory");

exports.getAll = async (req, res) => {
  const data = await Subcategory.find().populate("categoryId");
  res.json(data);
};

exports.create = async (req, res) => {
  const image = req.file?.filename || "";
  const created = await Subcategory.create({ ...req.body, image });
  res.status(201).json(created);
};

exports.update = async (req, res) => {
  const image = req.file?.filename || "";

  const updated = await Subcategory.findByIdAndUpdate(req.params.id, req.body, image,{
    new: true,
  });
  res.json(updated);
};

exports.remove = async (req, res) => {
  await Subcategory.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
