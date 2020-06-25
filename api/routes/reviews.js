const router = require("express").Router();
const Review = require("../models/Review");
const User = require("../models/User");

router.get("/", async (req, res) => {
  const reviews = await Review.find();
  res.send(reviews);
});

router.get("/:id", async (req, res) => {
  const admin = req.query.admin;
  const review = await Review.findOne({ id: req.params.id });
  if (!review)
    return res.redirect(
      `/${admin ? "admin/" : ""}reviews?error=No review with that id was found`
    );

  res.send(review);
});

router.post("/new", async (req, res) => {
  const { userID, reviewText, stars } = req.body;

  const alreadyReviewed = await Review.findOne({ author: { id: userID } });
  if (alreadyReviewed)
    return res.redirect(
      `/reviews/new?error=You have already submitted a review <a href="/reviews/${alreadyReviewed.id}">here</a>`
    );

  const user = await User.findOne({
    id: userID,
  });
  if (!user)
    return res.redirect(
      "/reviews/new?error=No user was found with your id. If this persists please contact an admin"
    );

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

  res.redirect(
    `/reviews?success=Thank you for the feeback! Your review was successfully submitted`
  );
});

module.exports = router;
