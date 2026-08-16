const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // For now, if no admin exists, create one (demo setup)
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({ username: 'admin', password: hashedPassword });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    req.session.adminId = admin._id;
    res.json({ message: 'Logged in successfully', username: admin.username });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/check', async (req, res) => {
  if (req.session && req.session.adminId) {
    const admin = await Admin.findById(req.session.adminId);
    if (admin) {
      return res.json({ isAuthenticated: true, username: admin.username });
    }
  }
  res.json({ isAuthenticated: false });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Could not log out' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
