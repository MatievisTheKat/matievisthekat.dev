const Router = require("express").Router;
const axios = require("axios");
const ms = require("ms");
const router = Router();

router.use(async (req, res, next) => {
  let nexted = false;
  const id = req.cookies ? req.cookies.userID : null;

  if (id) {
    const user = await axios.get(`/api/users/${id}`).catch((err) => {
      console.log(`CAUGHT ERROR WHEN REQUESTING USER: ${err.stack}`);
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
  });
});

module.exports = router;
