const { model, Schema } = require("mongoose");
const shortid = require("shortid");
const User = require("./User");

module.exports = model(
  "reviews",
  new Schema({
    id: { required: true, type: String, default: shortid.generate() },
    author: {
      type: Object,
      required: true,
      username: { type: String, required: true, default: "Anonymous" },
      id: { type: String, required: true },
      avatarURL: {
        type: String,
        required: true,
        default: "/avatars/default.png",
      },
      email: { type: String, required: true },
      emailVerified: { type: Boolean, required: true, default: false },
    },
    text: { type: String, required: true },
    stars: { type: Number, required: true },
  })
);
