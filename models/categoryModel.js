const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    CategoryName: {
      type: String,
      required: true,
    },
    CategoryImage: {
      type: Blob,
      required: true,
    },
},
  { timestamp: true }
);

const Categories = mongoose.model("Categories", categorySchema); //const Items = mongoose.model("Items", itemSchema); //

module.exports = Categories;