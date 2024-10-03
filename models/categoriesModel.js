const mongoose = require("mongoose");

const categoriesSchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    },
  { timestamp: true }
);

const Categories = mongoose.model("categories", categoriesSchema);

module.exports = Categories;