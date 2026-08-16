const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');

// Get all active announcements (Public)
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all announcements (Admin)
router.get('/all', auth, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create announcement (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const newAnnouncement = new Announcement({
      title: req.body.title,
      content: req.body.content,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update announcement (Protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body },
      { new: true }
    );
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete announcement (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
