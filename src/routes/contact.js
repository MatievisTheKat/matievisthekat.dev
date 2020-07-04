const router = require("express").Router();
const config = require("../config");

router.get("/", (req, res) =>
  res.render("contact", {
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
    user: req.user,
  })
);

router.get("/:method", (req, res, next) => {
  const method = req.params.method;
  const link = config.contacts[method];
  if (!link) return next();

  res.redirect(link);
});

module.exports = router;
