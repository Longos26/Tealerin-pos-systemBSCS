const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotanv = require("dotenv");
const { bgCyan } = require("colors");
require("colors");
const multer = require('multer');
const path = require('path');
const connectDb = require("./config/config");
//dotenv config
dotanv.config();
//db config
connectDb();
//rest object
const app = express();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Create the upload route
app.post('/api/categoriess/add-category', upload.single('Cimage'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  // Handle the category data (e.g., save to database)
  const categoryData = {
    Cname: req.body.Cname,
    Cimage: `http://localhost:8080/uploads/${req.file.filename}`, // Adjust URL as needed
  };

  // Save categoryData to your database here...

  res.status(200).json({ message: 'Category added successfully', category: categoryData });
});

//middlwares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

//routes
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bills", require("./routes/billsRoute"));
app.use("/api/categoriess", require("./routes/categoryRoute"));
//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`.bgCyan.white);
});