const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  userId: String,
  bookId: String,
  bookTitle: String,
  role: String,
  issueDate: Date,
  dueDate: Date,
  returned: { type: Boolean, default: false },
  fine: { type: Number, default: 0 }
});

module.exports = mongoose.model("Loan", loanSchema);