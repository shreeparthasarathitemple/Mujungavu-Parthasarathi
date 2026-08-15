const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');

// Get setting by key
router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    res.json(setting || { key: req.params.key, value: '' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update or create setting
router.post('/', auth, async (req, res) => {
  try {
    const { key, value } = req.body;
    let setting = await Setting.findOne({ key });
    
    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = await Setting.create({ key, value });
    }
    
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
