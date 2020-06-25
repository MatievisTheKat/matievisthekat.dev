const { model, Schema } = require("mongoose");
const { v4: uuid } = require("uuid");

module.exports = model(
  "users",
  new Schema({
    id: { required: true, type: String, default: uuid() },
    createdTimestamp: { required: true, default: Date.now(), type: String },
    passwordHash: { required: true, type: String },
    username: { required: true, type: String },
    email: { required: false, type: String },
    verifed: { type: Boolean, required: true, default: false },
    avatarURL: {
      type: String,
      required: true,
      default: "/avatars/default.png",
    },
    review: { type: Object, required: true, default: {} },
    bio: { required: false, type: String, default: "" },
    admin: { type: Boolean, default: false },
    name: {
      required: true,
      type: Object,
      first: { required: true, type: String },
      last: { required: true, type: String },
      full: {
        required: true,
        type: String,
      },
    },
  })
);
