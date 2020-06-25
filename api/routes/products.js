const { Router } = require("express");
const Product = require("../models/Product");
const router = Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products).status(200);
});

router.get("/:id", async (req, res) => {
  const admin = req.query.admin;
  const product = await Product.findOne({ id: req.params.id });
  if (!product)
    return res.redirect(
      `/${
        admin ? "admin/" : ""
      }products?error=No product with that id was found`
    );

  res.send(product);
});

router.post("/new", async (req, res) => {
  const { name, shortDesc, longDesc, price, features } = req.body;

  const nameInUse = await Product.findOne({ name });
  if (nameInUse)
    return res.redirect(
      "/admin/products/new?error=That name is already in use"
    );

  const product = new Product({
    name,
    slag: name.toLowerCase().replace(/ +/gi, "_"),
    desc: {
      short: shortDesc,
      long: longDesc,
    },
    price: parseInt(price),
    features: [...features.split(", ")],
  });

  const saved = await product.save();
  res.redirect(`/admin/products/${saved.id}`);
});

module.exports = router;
