const userModal = require("../models/userModel");

// login user
const loginController = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ message: "Please provide both userId and password" });
    }
    const user = await userModal.findOne({ userId, password, verified: true });
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
  }
};

//register
const registerController = async (req, res) => {
  try {
    const newUser = new userModal({ ...req.body, verified: true });
    await newUser.save();
    res.status(201).send("new User added Successfully!");
  } catch (error) {
    res.status(400).send("error", error);
    console.log(error);
  }
};

module.exports = {
  loginController,
  registerController,
};