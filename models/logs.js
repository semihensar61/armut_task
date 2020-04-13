const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LogsSchema = new Schema({
  log_user: { type: String, required: true },
  log_type: { type: Number, required: true }, //success or error / 0 for success 1 for error
  log_route: { type: String, required: true }, //shows the log belongs to which endpoint
  log_detail: { type: String, required: true }, //a detailed message about log
  createdAt: { type: Date, default: Date.now, required: true } //the time
});

module.exports = mongoose.model("logs", LogsSchema, "logs");
