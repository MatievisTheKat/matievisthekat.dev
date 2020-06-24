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

  if (!password) return res.redirect("/me/settings?error=Missing password");
  if (!email) return res.redirect("/me/settings?error=Missing email");
  if (!username) return res.redirect("/me/settings?error=Missing username");
  if (!confirmPassword)
    return res.redirect("/me/settings?error=Missing password confirmation");
  if (!firstName) return res.redirect("/me/settings?error=Missing first name");
  if (!lastName) return res.redirect("/me/settings?error=Missing last name");

  if (bio && bio.split(/ +/).length > 1000)
    return res.redirect(
      "/me/settings?error=Your bio may not be more than 1000 words long"
    );
  if (!validateEmail(email))
    return res.redirect("/me/settings?error=Invalid email address");
  if (!validatePassword(password))
    return res.redirect(
      "/me/settings?error=Passwords must contain at least 8 characters, 1 upperacse and 1 loweracse letter, 1 number and 1 special character"
    );
  if (!validateUsername(username))
    return res.redirect(
      "/me/settings?error=Usernames may only contain english characters, underscores and hyphens"
    );

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
  const { email, password } = req.body;

  if (!password) return res.redirect("/login?error=Missing password");
  if (!email) return res.redirect("/login?error=Missing email");

  if (!validateEmail(email))
    return res.redirect("/login?error=Invalid email address");
  if (!validatePassword(password))
    return res.redirect(
      "/login?error=Passwords must contain at least 8 characters, 1 upperacse and 1 loweracse letter, 1 number and 1 special character"
    );

  const user = await User.findOne({ email });
  if (!user) return res.redirect("/login?error=Invalid email address");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (match) {
    res.cookie("userID", user.id, { maxAge: ms("7 days") });
    res.redirect("/me");
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

  if (!password) return res.redirect("/signup?error=Missing password");
  if (!email) return res.redirect("/signup?error=Missing email");
  if (!username) return res.redirect("/signup?error=Missing username");
  if (!confirmPassword)
    return res.redirect("/signup?error=Missing password confirmation");
  if (!firstName) return res.redirect("/signup?error=Missing first name");
  if (!lastName) return res.redirect("/signup?error=Missing last name");

  if (!validateEmail(email))
    return res.redirect("/signup?error=Invalid email address");
  if (!validatePassword(password))
    return res.redirect(
      "/signup?error=Passwords must contain at least 8 characters, 1 upperacse and 1 loweracse letter, 1 number and 1 special character"
    );
  if (!validateUsername(username))
    return res.redirect(
      "/signup?error=Usernames may only contain english characters, underscores and hyphens"
    );

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

function validateEmail(email) {
  const match = email.match(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  );
  if (match && match[0] && !match[1]) return true;
  else return false;
}

function validatePassword(pass) {
  const match = pass.match(
    /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/
  );
  if (match) return true;
  else return false;
}

function validateUsername(username) {
  const match = username.match(/^[a-z0-9_-]{3,20}$/);
  if (match) return true;
  else return false;
}

module.exports = router;
