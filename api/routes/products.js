const { Router } = require("express");
const Product = require("../models/Product");
const router = Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products).status(200);
});

module.exports = router;
