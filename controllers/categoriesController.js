const categoriesModel = require("../models/categoriesModel");

// get items
const getCategoriesController = async (req, res) => {
  try {
    const items = await categoriesModel
.find();
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
  }
};

//add items
const addCategoriesController = async (req, res) => {
  try {
    const newItem = new categoriesModel
(req.body);
    await newItem.save();
    res.status(201).send("Categories Created Successfully!");
  } catch (error) {
    res.status(400).send("error", error);
    console.log(error);
  }
};

//update item
const editCategoriesController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    await categoriesModel
.findOneAndUpdate({ _id: itemId }, req.body, {
      new: true,
    });

    res.status(201).json("Categories Updated");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//delete item
const deleteCategoriesController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    await categoriesModel
.findOneAndDelete({ _id: itemId });
    res.status(200).json("Categories Deleted");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports = {
  getCategoriesController,
  addCategoriesController,
  editCategoriesController,
  deleteCategoriesController,
};