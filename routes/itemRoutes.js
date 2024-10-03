const express = require("express");
const multer = require("multer");
const {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
  upload, // Import upload middleware
} = require("./../controllers/itemController");

const router = express.Router();

// Routes
// GET - Retrieve items
router.get("/get-item", getItemController);

// POST - Add item with image upload
router.post("/add-item", upload.single("image"), addItemController);

// PUT - Edit item with image upload
router.put("/edit-item", upload.single("image"), editItemController);

// DELETE - Delete item
router.post("/delete-item", deleteItemController);

module.exports = router;
