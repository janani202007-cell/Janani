const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

console.log('🔐 Auth routes module loaded');

// Mock users for offline mode
const mockUsers = [
  { userId: "STU-101", password: "1234", role: "student", _id: "1" },
  { userId: "FAC-101", password: "1234", role: "faculty", _id: "2" },
  { userId: "LIB-101", password: "1234", role: "librarian", _id: "3" },
  { userId: "ADMIN", password: "admin", role: "admin", _id: "4" }
];

router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    
    // Check if MongoDB Atlas is connected (not just any MongoDB)
    const isAtlasConnected = mongoose.connection.readyState === 1 && 
      mongoose.connection.name && 
      mongoose.connection.name.includes('cluster0');
    
    if (isAtlasConnected) {
      // Use database
      const user = await User.findOne({ userId, password });
      if (user) {
        res.json({ success: true, message: 'Login Success ✅', user, mode: 'Database' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid Credentials ❌' });
      }
    } else {
      // Fallback to mock data for local/offline mode
      const user = mockUsers.find(u => u.userId === userId && u.password === password);
      if (user) {
        res.json({ success: true, message: 'Login Success ✅ (Local Mode)', user, mode: 'Local' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid Credentials ❌' });
      }
    }
  } catch (err) {
    console.log('Login error:', err);
    // If database error, try mock data
    const user = mockUsers.find(u => u.userId === req.body.userId && u.password === req.body.password);
    if (user) {
      res.json({ success: true, message: 'Login Success ✅ (Fallback Mode)', user, mode: 'Offline' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid Credentials ❌', error: err.message });
    }
  }
});

module.exports = router;