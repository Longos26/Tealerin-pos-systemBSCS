const itemModel = require("../models/itemModel");

// get items
const getItemController = async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).json(items); // Use res.json for consistency
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch items" }); // Send an error response
  }
};

// add items
const addItemController = async (req, res) => {
  try {
    const newItem = new itemModel(req.body);
    await newItem.save();
    res.status(201).json({ message: "Item Created Successfully!" }); // Use res.json for consistency
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to create item" }); // Send an error response
  }
};

// update item
const editItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    const updatedItem = await itemModel.findOneAndUpdate({ _id: itemId }, req.body, {
      new: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" }); // Handle not found case
    }

    res.status(200).json({ message: "Item Updated" }); // Use res.json for consistency
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to update item" }); // Send an error response
  }
};

// delete item
const deleteItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    const deletedItem = await itemModel.findOneAndDelete({ _id: itemId });

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" }); // Handle not found case
    }

    res.status(200).json({ message: "Item Deleted" }); // Use res.json for consistency
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to delete item" }); // Send an error response
  }
};

module.exports = {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
};
