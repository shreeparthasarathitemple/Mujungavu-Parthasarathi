const express = require('express');
const router = express.Router();
const Festival = require('../models/Festival');
const auth = require('../middleware/auth');

// Get all festivals
router.get('/', async (req, res) => {
  try {
    const festivals = await Festival.find().sort({ createdAt: -1 });
    res.json(festivals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create festival
router.post('/', auth, async (req, res) => {
  try {
    const newFestival = new Festival(req.body);
    const saved = await newFestival.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete festival
router.delete('/:id', auth, async (req, res) => {
  try {
    await Festival.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update festival
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedFestival = await Festival.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    res.json(updatedFestival);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
