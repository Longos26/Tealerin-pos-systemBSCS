const express = require("express");
const multer = require("multer");

const {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
} = require("./../controllers/itemController");

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure the uploads directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename file to avoid conflicts
  },
});
const upload = multer({ storage: storage });

// Routes

// Method - GET
router.get("/get-item", getItemController);

// Method - POST
router.post("/add-item", upload.single("image"), addItemController); // Handle image upload

// Method - PUT
router.put("/edit-item", upload.single("image"), editItemController); // Handle image upload

// Method - DELETE
router.delete("/delete-item", deleteItemController);

module.exports = router;
