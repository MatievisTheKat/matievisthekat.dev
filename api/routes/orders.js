const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");

router.post("/new", async (req, res) => {
  const { description, userID } = req.body;
  const user = await User.findOne({ id: userID });
  if (!user) return res.redirect("/orders/new?error=No user was found with that id");
  if (!description) return res.redirect("/orders/new?error=Please supply a valid description");

  const order = new Order({
    description,
    author: user,
  });
  const saved = await order.save();
});

module.exports = router;
