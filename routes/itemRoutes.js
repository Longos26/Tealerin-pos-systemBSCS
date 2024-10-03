const express = require("express");
const multer = require("multer");

const {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
} = require("./../controllers/itemController");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder to store images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Save with a unique name
  },
});

const upload = multer({ storage: storage });
//Method - get
router.get("/get-item", getItemController);

//MEthod - POST
router.post("/add-item", addItemController);

//method - PUT
router.put("/edit-item", editItemController);

//method - DELETE
router.post("/delete-item", deleteItemController);

module.exports = router;