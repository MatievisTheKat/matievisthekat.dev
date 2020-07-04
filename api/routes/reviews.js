const router = require("express").Router();
const Review = require("../models/Review");
const User = require("../models/User");

router.get("/", async (req, res) => {
  const reviews = await Review.find();
  res.send(reviews);
});

router.get("/getByUserID", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.send({ error: "Missing id value" });

  const review = (await Review.find()).find((r) => r.author.id === id);
  if (review) return res.send(review);
  else res.send(false);
});

router.post("/new", async (req, res) => {
  const { userID, reviewText, stars } = req.body;

  const alreadyReviewed = (await Review.find()).find((r) => r.author.id === userID && !r.deleted);
  if (alreadyReviewed)
    return res.redirect(
      `/reviews/new?error=You have already submitted a review <a href="/reviews/${alreadyReviewed.id}">here</a>`
    );

  const user = await User.findOne({
    id: userID,
  });
  if (!user)
    return res.redirect("/reviews/new?error=No user was found with your id. If this persists please contact an admin");

  const review = new Review({
    author: {
      username: user.username,
      id: user.id,
      avatarURL: user.avatarURL,
      email: user.email,
      emailVerified: user.emailVerified,
    },
    text: reviewText.trim(),
    stars: parseInt(stars),
  });

  const saved = await review.save();
  user.review = saved;
  await user.save();

  res.redirect(`/reviews?success=Thank you for the feeback! Your review was successfully submitted`);
});

router.post("/update", async (req, res) => {
  const { id, reviewText, stars } = req.body;
  const review = await Review.findOne({ id });
  if (!review)
    return res.redirect(
      "/reviews?error=Could not find a review with that id. If this persists please contact an admin"
    );

  review.text = reviewText;
  review.stars = parseInt(stars);
  review.edited = true;

  await review.save();
  res.redirect(`/reviews/${review.id}?success=Successfully updated`);
});

router.post("/delete", async (req, res) => {
  const review = await Review.findOne({ id: req.body.id });
  if (!review)
    return res.redirect(
      "/reviews?error=Could not find a review with that id. If this persists please contact an admin"
    );

  await review.delete();

  res.redirect("/reviews?success=Successfully removed that review");
});

router.get("/:id", async (req, res) => {
  const admin = req.query.admin;
  const review = await Review.findOne({ id: req.params.id });
  if (!review) return res.redirect(`/${admin ? "admin/" : ""}reviews?error=No review with that id was found`);

  res.send(review);
});

module.exports = router;
