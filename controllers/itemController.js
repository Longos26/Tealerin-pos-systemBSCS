const itemModel = require("../models/itemModel");

// Add item
const addItemController = async (req, res) => {
  try {
    const newItemData = { ...req.body };

    if (req.file) {
      newItemData.image = `/uploads/${req.file.filename}`; // Save image path
    }

    const newItem = new itemModel(newItemData);
    await newItem.save();
    res.status(201).send("Item Created Successfully!");
  } catch (error) {
    res.status(400).send("Error", error);
    console.log(error);
  }
};

// Edit item
const editItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    const updatedItemData = { ...req.body };

    if (req.file) {
      updatedItemData.image = `/uploads/${req.file.filename}`; // Update image path
    }

    await itemModel.findOneAndUpdate({ _id: itemId }, updatedItemData, {
      new: true,
    });

    res.status(201).json("Item Updated");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};
