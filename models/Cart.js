const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["Product", "Medicine", "LabTest", "HealthCheckup"],
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "items.itemType", // Dynamic reference based on itemType
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    priceAtAdd: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
