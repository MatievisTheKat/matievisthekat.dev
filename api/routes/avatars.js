const { Router } = require("express");
const fs = require("fs");
const User = require("../models/User");
const path = require("path");
const router = Router();

router.get("/:userID", (req, res) => {
  const { userID } = req.params;
  const avatarURL = fs.existsSync(path.join(__dirname, `../../src/public/avatars/${userID}.png`))
    ? `/avatars/${userID}.png`
    : "/avatars/default.png";
  res.send(avatarURL);
});

router.post("/delete/:userID", async (req, res) => {
  const { userID } = req.params;
  const user = await User.findOne({ id: userID });
  if (!userID || !user) return res.redirect("/login?error=You need to be logged in to do that!");

  const avPath = path.join(__dirname, `../../src/public/avatars/${userID}.png`);
  if (!fs.existsSync(avPath)) {
    return res.redirect("/me/settings?error=You cannot remove the default avatar");
  }

  user.avatarURL = "/avatars/default.png";
  await user.save();

  fs.unlinkSync(avPath);
  res.redirect("/me/settings?success=Removed your avatar");
});

router.post("/createOrReplace", async (req, res) => {
  let failed = false;
  if (!req.files) return res.redirect("/me/avatar/change?error=Something went wrong. Try again");

  const { file } = req.files;
  const { userID } = req.body;
  const user = await User.findOne({ id: userID });
  if (!userID || !user) return res.redirect("/login?error=You need to be logged in to do that!");

  const supportedFileTypes = ["png", "jpg", "jpeg"];
  if (!supportedFileTypes.includes(file.name.split(".").pop())) {
    return res.redirect(
      `/me/avatar/change?error=Unsupported file type! Please only use ${supportedFileTypes.join(", ")} image types`
    );
  }

  const avPath = path.join(__dirname, `../../src/public/avatars/${userID}.png`);
  fs.writeFile(avPath, file.data, (err) => {
    if (err) {
      failed = true;
      console.error(err);
      return res.redirect("/me/settings?error=Failed to change avatar. Please try again");
    }
  });
  
  user.avatarURL = avPath.split("public")[1].replace(/\\/gi, "/");
  await user.save();

  if (!failed) {
    res.redirect(`/me/settings?success=Changed your avatar!`);
  }
});

module.exports = router;
