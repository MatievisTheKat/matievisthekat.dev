const router = require("express").Router();

router.get("/new", (req, res) => {
  if (!req.user) return res.redirect("/login?error=You must be logged in to do that&redirect=/orders/new");
  if (!req.user.verified) return res.redirect("/me?error=Please verify your email address before placing an order");

  res.render("orders/new", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  });
});

module.exports = router;
