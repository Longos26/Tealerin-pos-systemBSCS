const itemModel = require("../models/itemModel");

const getItemController = async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Add categories
const addItemController = async (req, res) => {
  try {
    const newItem = new itemModel(req.body);
    await newItem.save();
    res.status(201).send({ message: "Item Created Successfully!" });
  } catch (error) {
    console.log(error);
    // Send a response with a message and the error details
    res.status(400).send({ message: "Error creating item", error: error.message });
  }
};

// Update item
const editItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    await itemModel.findOneAndUpdate({ _id: itemId }, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Item Updated" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error updating item", error: error.message });
  }
};

// Delete item
const deleteItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    await itemModel.findOneAndDelete({ _id: itemId });
    res.status(200).json({ message: "Item Deleted" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error deleting item", error: error.message });
  }
};

module.exports = {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
};
