const { Router } = require("express");
const router = Router();

router.get("/", (req, res) =>
  res.render("legal/index", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  })
);

router.get("/cookie-policy", (req, res) =>
  res.render("legal/cookie-policy", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  })
);

router.get("/privacy-policy", (req, res) =>
  res.render("legal/privacy-policy", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  })
);

router.get("/terms", (req, res) =>
  res.render("legal/terms", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  })
);

router.get("/disclaimer", (req, res) =>
  res.render("legal/disclaimer", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  })
);

router.get("/acceptable-use", (req, res) =>
  res.render("legal/acceptable-use", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  })
);

router.get("/refunds", (req, res) =>
  res.render("legal/refunds", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  })
);

module.exports = router;
