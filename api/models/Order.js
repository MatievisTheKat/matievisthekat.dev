const { model, Schema } = require("mongoose");
const { v4: uuid } = require("uuid");

module.exports = model(
  "orders",
  new Schema({
    id: { type: String, required: true, default: uuid() },
    description: { type: String, required: true },
    author: { type: Object, required: true },
  })
);
