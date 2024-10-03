const itemModel = require("../models/itemModel");

// Get items
const getItemController = async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).json(items); // Use json() for sending arrays and objects
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send("Internal Server Error");
  }
};

// Add items
const addItemController = async (req, res) => {
  try {
    const newItem = new itemModel({
      name: req.body.name,
      price: req.body.price,
      size: req.body.size,
      pieces: req.body.pieces,
      category: req.body.category,
      image: req.file ? req.file.path : null, // Check if file exists before assigning
    });
    
    await newItem.save();
    res.status(201).json({ message: "Item Created Successfully!", item: newItem });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ error: "Error creating item: " + error.message });
  }
};

// Update item
const editItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    
    const updateData = {
      name: req.body.name,
      price: req.body.price,
      size: req.body.size,
      pieces: req.body.pieces,
      category: req.body.category,
    };

    // Check if there is an uploaded image, and set the image path if it exists
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedItem = await itemModel.findByIdAndUpdate(itemId, updateData, { new: true });
    
    if (!updatedItem) {
      return res.status(404).send("Item not found.");
    }
    
    res.status(200).json({ message: "Item Updated Successfully!", item: updatedItem });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ error: "Error updating item: " + error.message });
  }
};

// Delete item
const deleteItemController = async (req, res) => {
  try {
    const { itemId } = req.body; // Expecting itemId in the request body
    if (!itemId) {
      return res.status(400).send("Item ID is required.");
    }
    
    const deletedItem = await itemModel.findByIdAndDelete(itemId);
    
    if (!deletedItem) {
      return res.status(404).send("Item not found.");
    }
    
    res.status(200).send("Item Deleted Successfully!");
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Error deleting item: " + error.message });
  }
};

module.exports = {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
};
