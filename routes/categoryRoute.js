const express = require("express");
const {
  getCategoryController,
  addCategoryController,
  editCategoryController,
  deleteCategoryController,
} = require("./../controllers/categoryController");
const multer = require('multer');
const path = require('path');

// Define constants for route paths
const ROUTE_PATHS = {
  GET_CATEGORY: "/get-category",
  EDIT_CATEGORY: "/edit-category",
  DELETE_CATEGORY: "/delete-category",
  ADD_CATEGORY: "/add-category",
};

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Create a router instance
const router = express.Router();

// Define routes
router.get(ROUTE_PATHS.GET_CATEGORY, getCategoryController);
router.put(ROUTE_PATHS.EDIT_CATEGORY, editCategoryController);
router.delete(ROUTE_PATHS.DELETE_CATEGORY, deleteCategoryController);
router.post(ROUTE_PATHS.ADD_CATEGORY, upload.single('Cimage'), addCategoryController);

// Export the router
module.exports = router;