const categoryModel = require("../models/categoryModel");

// get items
const getCategoryController = async (req, res) => {
  try {
    const categoriess = await categoryModel.find(); //items=categoriess //itemModel=categoryModel
    res.status(200).send(categoriess);
  } catch (error) {
    console.log(error);
  }
};

//add items
const addCategoryController = async (req, res) => { //newItem = newCategory
  try {
    const newCategory = new categoryModel(req.body);
    await newCategory.save();
    res.status(201).send("Category Created Successfully!");
  } catch (error) {
    res.status(400).send("error", error);
    console.log(error);
  }
};

//update item
const editCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.body; //itemId = categoryId
    console.log(categoryId);
    await categoryModel.findOneAndUpdate({ _id: categoryId }, req.body, {
      new: true,
    });

    res.status(201).json("category Updated");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
//delete item
const deleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.body;
    console.log(categoryId);
    await categoryModel.findOneAndDelete({ _id: categoryId });
    res.status(200).json("category Deleted");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports = {
  getCategoryController,
  addCategoryController,
  editCategoryController,
  deleteCategoryController,
};
