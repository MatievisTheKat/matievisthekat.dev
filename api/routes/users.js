const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const ms = require("ms");
const router = Router();

router.post("/delete/:userID", async (req, res) => {
  const id = req.params.userID;
  const user = await User.findOne({ id });
  if (!user)
    return res.redirect("/login?error=You must be logged in to do that");

  await user.delete();
  res.clearCookie("userID");
  res.redirect("/login?success=Successfully deleted your account");
});

router.get("/:userID", async (req, res) => {
  const id = req.params.userID;
  const user = await User.findOne({ id });
  if (!user)
    return res
      .send({ status: 404, error: "No user found with that ID" })
      .status(200);

  res.send(user).status(200);
});

router.post("/update/:userID", async (req, res) => {
  const id = req.params.userID;
  const user = await User.findOne({ id });
  if (!user)
    return res.redirect("/login?error=You need to be logged in to do that");

  const {
    email,
    password,
    bio,
    confirmPassword,
    username,
    firstName,
    lastName,
    avatarURL,
  } = req.body;

  if (password !== confirmPassword)
    return res.redirect("/me/settings?error=Passwords do not match");

  const passwordHash = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS)
  );

  const emailInUse = await User.findOne({ email });
  if (emailInUse && emailInUse.id !== user.id)
    return res.redirect("/me/settings?error=That email is already in use");
  const usernameInUse = await User.findOne({ username });
  if (usernameInUse && usernameInUse.id !== user.id)
    return res.redirect(
      "/me/settings?error=That username is not available. Please choose another"
    );

  user.bio = bio || "";
  user.email = email.toLowerCase().trim();
  user.passwordHash = passwordHash;
  user.name = {
    first: firstName.trim().toProperCase(),
    last: lastName.trim().toProperCase(),
  };
  user.username = username;
  user.avatarURL = avatarURL || "/avatars/default.png";
  user.name.full = `${user.name.first} ${user.name.last}`.toProperCase();

  await user.save();
  res.redirect("/me/settings?success=Successfully updated");
});

router.post("/login", async (req, res) => {
  const { email, password, redirect } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.redirect("/login?error=Invalid email address");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (match) {
    res.cookie("userID", user.id, { maxAge: ms("7 days") });
    res.redirect(redirect || "/me");
  } else {
    res.redirect("/login?error=Incorrect password");
  }
});

router.post("/signup", async (req, res) => {
  const { password, confirmPassword, firstName, lastName } = req.body;
  const username = req.body.username.trim().toLowerCase();
  const email = req.body.email.trim().toLowerCase();

  if (password !== confirmPassword)
    return res.redirect("/signup?error=Passwords do not match");

  const passwordHash = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS)
  );

  const emailInUse = await User.findOne({ email });
  if (emailInUse)
    return res.redirect("/signup?error=That email is already in use");
  const usernameInUse = await User.findOne({ username });
  if (usernameInUse)
    return res.redirect(
      "/signup?error=That username is not available. Please choose another"
    );

  const user = new User({
    passwordHash,
    username,
    email,
    name: {
      first: firstName.trim().toProperCase(),
      last: lastName.trim().toProperCase(),
    },
  });
  user.name.full = `${user.name.first} ${user.name.last}`.toProperCase();

  const saved = await user.save();
  res.cookie("userID", saved.id, { maxAge: ms("7 days") });
  res.redirect("/me");
});

router.post("/logout", (req, res) => {
  if (!req.body.userID)
    return res.redirect("/login?error=You need to be logged in to do that!");
  res.clearCookie("userID");
  res.redirect("/login?success=Successfully logged out");
});

module.exports = router;
