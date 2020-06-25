const router = require("express").Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  const rawReviews = await axios.get("/api/reviews");
  const reviews = rawReviews.data.filter((r) => !r.deleted);
  const totalStars = reviews.reduce((a, b) => (a += parseInt(b.stars)), 0);
  const averageStars = Math.floor((totalStars / reviews.length) * 10) / 10;
  res.render("reviews/list", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
    reviews: reviews.reverse(),
    averageStars,
  });
});

router.get("/new", async (req, res) => {
  if (!req.user)
    return res.redirect(
      "/login?error=You need to be logged in to do that&redirect=/reviews/new"
    );

  const previousReview = await axios.get(
    `/api/reviews/getByUserID?id=${req.user.id}`
  );
  if (previousReview.data.id)
    return res.redirect(
      `/reviews?error=You have already submitted a review! View it <a href="/reviews/${previousReview.data.id}">here</a>`
    );

  res.render("reviews/new", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
  });
});

router.get("/:id/edit", async (req, res) => {
  const review = await axios.get(`/api/reviews/${req.params.id}`);
  res.render("reviews/edit", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
    review: review.data,
  });
});

router.get("/:id", async (req, res) => {
  const review = await axios.get(`/api/reviews/${req.params.id}`);
  res.render("reviews/one", {
    user: req.user,
    error: req.query.error,
    success: req.query.success,
    warning: req.query.warning,
    review: review.data,
  });
});

module.exports = router;
