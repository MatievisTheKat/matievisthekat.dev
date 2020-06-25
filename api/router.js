require("dotenv").config();

const { Router } = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const uri = process.env.MONGODB_URI;
const dev = process.env.DEV ? true : false;
const router = Router();

// Body Parser middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(fileUpload());

// Routes
router.use("/avatars", require("./routes/avatars"));
router.use("/users", require("./routes/users"));
router.use("/products", require("./routes/products"));
router.use("/reviews", require("./routes/reviews"));

// 404 handling
router.use((req, res, next) => {
  res.send({ status: 404, error: "Path not found" }).status(404);
});

// 500 handling
router.use((error, req, res, next) => {
  if (dev) res.send(error.stack).status(500);
  else res.send({ status: 500, error: "Something broke" }).status(500);
});

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
  console.log("Connected to MongoDB")
);

module.exports = router;
