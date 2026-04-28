const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan");
const Book = require("../models/book");
const { isDatabaseAvailable } = require("../dbManager");


// ISSUE BOOK
router.post("/issue", async (req, res) => {
  try {
    if (!isDatabaseAvailable()) {
      return res.status(503).json({ 
        success: false, 
        message: "Database not available. Cannot issue book in offline mode.",
        mode: "Offline"
      });
    }

    const { userId, role, bookId, bookTitle } = req.body;

    // Check if book is available
    const book = await Book.findById(bookId);
    if (!book || book.available <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Book not available for issue" 
      });
    }

    let days = role === "faculty" ? 90 : 14;

    let dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const loan = new Loan({
      userId,
      bookId,
      bookTitle,
      role,
      issueDate: new Date(),
      dueDate
    });

    await loan.save();

    // update book availability
    await Book.findByIdAndUpdate(bookId, { $inc: { available: -1 } });

    res.json({ success: true, message: "Book issued successfully ✅", data: loan });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error issuing book: " + err.message });
  }
});


// RETURN BOOK
router.post("/return", async (req, res) => {
  try {
    if (!isDatabaseAvailable()) {
      return res.status(503).json({ 
        success: false, 
        message: "Database not available. Cannot return book in offline mode.",
        mode: "Offline"
      });
    }

    const { loanId } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found" });
    }

    let fine = 0;
    const today = new Date();

    if (today > loan.dueDate) {
      const diffDays = Math.ceil((today - loan.dueDate) / (1000 * 60 * 60 * 24));
      fine = diffDays * 2;
    }

    loan.returned = true;
    loan.fine = fine;

    await loan.save();

    // update book availability
    await Book.findByIdAndUpdate(loan.bookId, { $inc: { available: 1 } });

    res.json({ success: true, fine, message: "Book returned successfully ✅", data: loan });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error returning book: " + err.message });
  }
});


// GET USER HISTORY
router.get("/:userId", async (req, res) => {
  try {
    if (isDatabaseAvailable()) {
      const loans = await Loan.find({ userId: req.params.userId });
      res.json({ success: true, data: loans, mode: "Database" });
    } else {
      // No loans in offline mode
      res.json({ success: true, data: [], mode: "Mock Data (Offline)", message: "No loans available in offline mode" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Error retrieving loans: " + err.message });
  }
});

module.exports = router;