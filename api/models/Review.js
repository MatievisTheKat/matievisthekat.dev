const { model, Schema } = require("mongoose");
const shortid = require("shortid");
const User = require("./User");

module.exports = model(
  "reviews",
  new Schema({
    id: { required: true, type: String, default: shortid.generate() },
    author: {
      type: User,
      required: true,
    },
    text: { type: String, required: true },
    stars: { type: Number, required: true },
  })
);
