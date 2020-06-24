const { model, Schema } = require("mongoose");
const shortid = require("shortid");

module.exports = model(
  "products",
  new Schema({
    id: { type: String, required: true, default: shortid.generate() },
    name: { type: String, required: true },
    slag: { type: String, required: true },
    desc: {
      type: Object,
      required: true,
      short: { type: String, required: true },
      long: { type: String, required: true },
    },
    createdTimestamp: { required: true, type: String, default: Date.now() },
    price: { type: Number, required: true },
    features: { type: [String] },
  })
);
