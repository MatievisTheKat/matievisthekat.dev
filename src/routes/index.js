const Router = require("express").Router;
const axios = require("axios");
const ms = require("ms");
const router = Router();

router.use(async (req, res, next) => {
  let nexted = false;
  const id = req.cookies ? req.cookies.userID : null;

  if (id) {
    const user = await axios.get(`http://localhost:${process.env.PORT}/api/users/${id}`).catch((err) => {
      next();
      nexted = true;
    });

    if (user && user.data && user.data.id) req.user = user.data;
    res.cookie("userID", id, { maxAge: ms("7 days") });
  }

  if (!nexted) next();
});

router.use("/products", require("./products"));
router.use("/me", require("./me"));
router.use("/legal", require("./legal"));
router.use("/reviews", require("./reviews"));
router.use("/contact", require("./contact"));
router.use("/orders", require("./orders"));

router.get("/", (req, res) => {
  res.render("index", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  });
});

router.get("/signup", (req, res) => {
  if (req.user && req.user.id) return res.redirect("/me");

  res.render("signup", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  });
});

router.get("/login", (req, res) => {
  if (req.user && req.user.id) return res.redirect("/me");

  res.render("login", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
    redirect: req.query.redirect,
  });
});

module.exports = router;
