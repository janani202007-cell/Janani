const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Book = require("../models/book");
const { getMockData, isDatabaseAvailable } = require("../dbManager");

// Mock books for offline mode
const mockBooks = [
  { _id: "1", title: "Data Structures", author: "Mark Allen Weiss", branch: "CS", available: 5 },
  { _id: "2", title: "Algorithms", author: "Cormen", branch: "CS", available: 3 },
  { _id: "3", title: "Database Systems", author: "Elmasri", branch: "IT", available: 2 }
];

// GET all books
router.get("/", async (req, res) => {
  try {
    if (isDatabaseAvailable()) {
      // Use database
      const books = await Book.find();
      res.json({ success: true, data: books, mode: "Database" });
    } else {
      // Fallback to mock data
      res.json({ success: true, data: mockBooks, mode: "Mock Data (Offline)" });
    }
  } catch (err) {
    // Double fallback on error
    res.json({ success: true, data: mockBooks, mode: "Mock Data (Error Fallback)" });
  }
});

// ADD book
router.post("/add", async (req, res) => {
  try {
    if (!isDatabaseAvailable()) {
      return res.status(503).json({ 
        success: false, 
        message: "Database not available. Cannot add book in offline mode.",
        mode: "Offline"
      });
    }

    const newBook = new Book(req.body);
    await newBook.save();
    res.json({ success: true, message: "Book added successfully ✅", data: newBook });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding book: " + err.message });
  }
});

module.exports = router;