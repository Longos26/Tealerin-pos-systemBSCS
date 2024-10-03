//itemRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
} = require("./../controllers/itemController");

const router = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // avoid name collisions
  },
});
const upload = multer({ storage });

//routes
//Method - get
router.get("/get-item", getItemController);

//MEthod - POST
router.post("/add-item", upload.single("image"), addItemController);

//method - PUT
router.put("/edit-item", editItemController);

//method - DELETE
router.post("/delete-item", deleteItemController);

module.exports = router;