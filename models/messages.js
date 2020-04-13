const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
  send_from: { type: String, required: true },
  send_to: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model("MessagesShema", MessagesSchema, "messages");
