const itemModel = require("../models/itemModel");
const upload = require("../middlewares/uploadmiddleware");
const multer = require("multer");
const path = require("path");

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage: storage });

// get items
const getItemController = async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching items");
  }
};

// add items
const addItemController = async (req, res) => {
  try {
    const { name, price, size, pieces, category } = req.body;
    const newItem = new itemModel({
      name,
      price,
      size,
      pieces,
      category,
      image: req.file.path, // Save the path to the uploaded file
    });
    await newItem.save();
    res.status(201).send("Item Created Successfully!");
  } catch (error) {
    res.status(400).send("Error creating item");
    console.log(error);
  }
};

// update item
const editItemController = async (req, res) => {
  try {
    const { itemId, ...updateData } = req.body;
    if (req.file) {
      updateData.image = req.file.path; // Update image path if a new file is uploaded
    }
    await itemModel.findOneAndUpdate({ _id: itemId }, updateData, {
      new: true,
    });
    res.status(201).json("Item Updated");
  } catch (error) {
    res.status(400).send("Error updating item");
    console.log(error);
  }
};

// delete item
const deleteItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    await itemModel.findOneAndDelete({ _id: itemId });
    res.status(200).json("Item Deleted");
  } catch (error) {
    res.status(400).send("Error deleting item");
    console.log(error);
  }
};

module.exports = {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
  upload, // Export upload middleware
};
