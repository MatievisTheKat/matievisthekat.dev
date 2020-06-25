const router = require("express").Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  const reviews = await axios.get("/api/reviews");
  const totalStars = reviews.data.reduce((a, b) => (a += parseInt(b.stars)), 0);
  const averageStars = Math.floor((totalStars / reviews.data.length) * 10) / 10;
  res.render("reviews/list", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
    reviews: reviews.data.reverse(),
    averageStars,
  });
});

router.get("/new", (req, res) => {
  if (!req.user)
    return res.redirect(
      "/login?error=You need to be logged in to do that&redirect=/reviews/new"
    );

  res.render("reviews/new", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  });
});

module.exports = router;
