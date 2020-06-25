require("dotenv").config();

// Import dependencies
const { Router } = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mailer = require("nodemailer");
const fileUpload = require("express-fileupload");

// Setup
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

// Send mail
router.post("/email", async (req, res) => {
  const transporter = mailer.createTransport({
    host: "webmail.matievisthekat.dev",
    port: 465,
    secure: true,
    auth: {
      user: "no-reply@matievisthekat.dev",
      pass: "Cvdm08&0",
    },
  });

  const info = await transporter.sendMail({
    from: '"matievisthekat.dev" <no-reply@matievisthekat.dev>', // sender address
    to: req.body.emails, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log(info);
});

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
