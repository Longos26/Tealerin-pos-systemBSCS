const express = require("express");
const {
  getCategoryController, //getCategoryController,
  addCategoryController,
  editCategoryController,
  deleteCategoryController,
} = require("./../controllers/categoryController");

const router = express.Router();


//Method - get
router.get("/get-category", getCategoryController); // "/get-category" //

//MEthod - POST
router.post("/add-category", addCategoryController);

//method - PUT
router.put("/edit-category", editCategoryController);

//method - DELETE
router.post("/delete-category", deleteCategoryController);

module.exports = router;
