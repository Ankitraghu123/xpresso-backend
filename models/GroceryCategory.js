const mongoose = require("mongoose");

const groceryCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true }, 

});

module.exports = mongoose.model("GroceryCategory", groceryCategorySchema);
