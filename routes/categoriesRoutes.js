const express = require("express");
const {
  addCategoriesController,
  getCategoriesController,
  editCategoriesController,
  deleteCategoriesController,
} = require("../controllers/categoriesController");

const router = express.Router();

//routes

//MEthod - POST
router.post("/add-categories", addCategoriesController);

//MEthod - GET
router.get("/get-categories", getCategoriesController); //getCategoriesController

//method - PUT
router.put("/edit-categories", editCategoriesController);

//method - DELETE
router.post("/delete-categories", deleteCategoriesController);

module.exports = router;