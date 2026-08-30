const express = require('express');
const router = express.Router();
const News = require('../models/News');
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');

// Get all published news
router.get('/', async (req, res) => {
  try {
    const news = await News.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all news (admin)
router.get('/all', auth, async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single news
router.get('/:id', async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).json({ message: 'News not found' });
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate content using Gemini
router.post('/generate', auth, async (req, res) => {
  try {
    const { adminTitle, adminDescription } = req.body;
    
    // Fetch API key from DB
    const setting = await Setting.findOne({ key: 'geminiApiKey' });
    if (!setting || !setting.value) {
      return res.status(400).json({ message: 'Gemini API key is not configured in settings.' });
    }
    
    const apiKey = setting.value;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const prompt = `You are an expert news editor for a traditional Hindu temple, Sri Parthasarathi Temple in Mujungavu. 
Your tone must be "Devotional and traditional, formal and journalistic".
I will provide you with a basic title and a short description of an upcoming event or news. 
Please generate a structured JSON output containing:
- "title": An attractive, engaging, and devotional news title based on the input.
- "blurb": A short, catchy 2-3 sentence summary/description for the news portal listing.
- "content": A full, well-written article body (in HTML format, using <p>, <strong>, etc.) expanding on the topic, suitable for reading.

Here is the input:
Title: ${adminTitle}
Description: ${adminDescription}

Return only raw JSON. Do not include markdown code block backticks around the JSON. Your response must be parseable by JSON.parse().
    `;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    };

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      console.error('Gemini API Error:', data);
      return res.status(500).json({ message: 'Error generating content from Gemini API.' });
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    try {
      const parsedContent = JSON.parse(generatedText);
      res.json(parsedContent);
    } catch (parseErr) {
      console.error("Failed to parse JSON from Gemini", generatedText);
      res.status(500).json({ message: 'Failed to parse generated content. Please try again.' });
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during generation' });
  }
});

// Create new news article
router.post('/', auth, async (req, res) => {
  try {
    const newArticle = new News(req.body);
    const saved = await newArticle.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update news article
router.put('/:id', auth, async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete news article
router.delete('/:id', auth, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
