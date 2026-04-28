const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  branch: String,
  available: Number
});

module.exports = mongoose.model("Book", bookSchema);