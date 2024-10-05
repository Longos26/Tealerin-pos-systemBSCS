const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    Cname: {
      type: String,
      required: true,
    },
    Cimage: {
      type: String,
      required: true,
    },
},
  { timestamp: true }
);

const Categories = mongoose.model("Categories", categorySchema); //const Items = mongoose.model("Items", itemSchema); //

module.exports = Categories;