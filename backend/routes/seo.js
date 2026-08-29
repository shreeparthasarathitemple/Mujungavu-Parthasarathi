const express = require('express');
const router = express.Router();
const Seo = require('../models/Seo');
const auth = require('../middleware/auth');

// Public route to get all SEO settings
router.get('/', async (req, res) => {
  try {
    const seoData = await Seo.find();
    res.json(seoData);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Public route to get SEO settings for a specific page
router.get('/page', async (req, res) => {
  const { route } = req.query;
  if (!route) {
    return res.status(400).json({ message: 'Route parameter is required' });
  }

  try {
    const seoData = await Seo.findOne({ pageRoute: route });
    if (!seoData) {
      return res.status(404).json({ message: 'SEO data not found for this route' });
    }
    res.json(seoData);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin route to create or update SEO settings for a page
router.post('/', auth, async (req, res) => {
  const { pageRoute, title, description, keywords, imageUrl } = req.body;

  if (!pageRoute || !title || !description) {
    return res.status(400).json({ message: 'Page route, title, and description are required' });
  }

  try {
    let seoData = await Seo.findOne({ pageRoute });

    if (seoData) {
      // Update existing
      seoData.title = title;
      seoData.description = description;
      seoData.keywords = keywords;
      seoData.imageUrl = imageUrl;
      seoData.updatedAt = Date.now();
      await seoData.save();
      return res.json(seoData);
    } else {
      // Create new
      seoData = new Seo({ pageRoute, title, description, keywords, imageUrl });
      await seoData.save();
      return res.status(201).json(seoData);
    }
  } catch (err) {
    console.error('SEO save error:', err);
    res.status(500).json({ message: 'Server error saving SEO data' });
  }
});

// Admin route to delete SEO setting
router.delete('/:id', auth, async (req, res) => {
  try {
    await Seo.findByIdAndDelete(req.params.id);
    res.json({ message: 'SEO setting deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
