const mongoose = require("mongoose");

// Define constants for model names
const MODEL_NAMES = {
  CATEGORIES: "Category",
};

// Define the category schema
const categorySchema = new mongoose.Schema(
  {
    Cname: {
      type: String,
      required: true,
      trim: true, // Automatically trims whitespace
    },
    Cimage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the model from the schema
const Category = mongoose.model(MODEL_NAMES.CATEGORIES, categorySchema);

// Export the model
module.exports = Category;