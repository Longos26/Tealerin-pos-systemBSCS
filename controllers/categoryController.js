const categoryModel = require("../models/categoryModel");

// Constants for status codes and messages
const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
};

const MESSAGES = {
  CATEGORY_CREATED: "Category Created Successfully!",
  CATEGORY_UPDATED: "Category Updated Successfully!",
  CATEGORY_DELETED: "Category Deleted Successfully!",
  CATEGORY_NOT_FOUND: "Category not found.",
  SERVER_ERROR: "Something went wrong. Please try again.",
};

// Get all categories
const getCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(STATUS_CODES.SUCCESS).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(STATUS_CODES.BAD_REQUEST).json({ error: MESSAGES.SERVER_ERROR });
  }
};

// Update category
const editCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const updatedCategory = await categoryModel.findByIdAndUpdate(categoryId, req.body, { new: true });

    if (!updatedCategory) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: MESSAGES.CATEGORY_NOT_FOUND });
    }

    res.status(STATUS_CODES.CREATED).json({ message: MESSAGES.CATEGORY_UPDATED });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(STATUS_CODES.BAD_REQUEST).json({ error: MESSAGES.SERVER_ERROR });
  }
};

// Delete category
const deleteCategoryController = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ error: MESSAGES.CATEGORY_NOT_FOUND });
    }

    res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.CATEGORY_DELETED });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(STATUS_CODES.BAD_REQUEST).json({ error: MESSAGES.SERVER_ERROR });
  }
};

// Add category
const addCategoryController = async (req, res) => {
  try {
    const { Cname } = req.body;
    const Cimage = req.file ? `http://localhost:${process.env.PORT || 8080}/uploads/${req.file.filename}` : null;

    const newCategory = new categoryModel({ Cname, Cimage });
    await newCategory.save();

    res.status(STATUS_CODES.CREATED).json({ message: MESSAGES.CATEGORY_CREATED, category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(STATUS_CODES.BAD_REQUEST).json({ error: MESSAGES.SERVER_ERROR });
  }
};

module.exports = {
  getCategoryController,
  addCategoryController,
  editCategoryController,
  deleteCategoryController,
};