const { model, Schema } = require("mongoose");
const shortid = require("shortid");

module.exports = model(
  "reviews",
  new Schema({
    id: { required: true, type: String, default: shortid.generate() },
    edited: { type: Boolean, required: true, default: false },
    featured: { type: Boolean, required: true, default: false },
    author: {
      type: Object,
      required: true,
      username: { type: String, required: true, default: "Anonymous" },
      createdTimestamp: { type: String, required: true },
      id: { type: String, required: true },
      avatarURL: {
        type: String,
        required: true,
        default: "/avatars/default.png",
      },
      email: { type: String, required: true },
      verified: { type: Boolean, required: true, default: false },
    },
    text: { type: String, required: true },
    stars: { type: Number, required: true },
  })
);
