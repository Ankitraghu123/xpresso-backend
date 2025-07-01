// models/MilkProduct.js
const mongoose = require("mongoose");

const milkProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // Product image
  quantity: { type: Number, required: true }, // e.g., 1
  unit: { type: String, enum: ["Litre", "ml"], default: "Litre" }, // Unit
  price: { type: Number, required: true },
  deliveryTime: { type: String, default: "11 MINS" },
  // Subscription details
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MilkCategory",
    required: true,
  },
});

module.exports = mongoose.model("MilkProduct", milkProductSchema);
