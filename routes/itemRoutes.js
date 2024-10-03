const express = require("express");
const multer = require("multer");
const path = require("path"); // Import path for file handling
const {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
} = require("./../controllers/itemController");

const router = express.Router();

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // Rename the file to avoid conflicts
  },
});

const upload = multer({ storage });

// Routes

// Method - GET
router.get("/get-item", getItemController);

// Method - POST for adding items
router.post("/add-item", addItemController);

// Method - PUT for editing items
router.put("/edit-item", editItemController);

// Method - DELETE for deleting items
router.post("/delete-item", deleteItemController);

// Method - POST for image upload
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imageUrl = `http://localhost:8080/uploads/${req.file.filename}`; // URL to access the uploaded image
  res.json({ imageUrl }); // Send back the image URL
});

module.exports = router;
