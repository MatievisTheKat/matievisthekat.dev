const { Router } = require("express");
const router = Router();

router.use((req, res, next) => {
  if (!req.user)
    return res.redirect("/login?error=You must be logged in to do that!");
  else next();
});

router.get("/", (req, res) => {
  res.render("me", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  });
});

router.get("/settings", (req, res) => {
  res.render("user-settings", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  });
});

router.get("/avatar", (req, res) =>
  res.redirect(`/avatars/${req.user.id}.png`)
);

router.get("/avatar/change", (req, res) => {
  res.render("settings/change-avatar", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  });
});

router.get("/logout", (req, res) =>
  res.render("logout", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  })
);

module.exports = router;
