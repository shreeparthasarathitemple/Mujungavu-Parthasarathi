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

// Dynamic Share Route for WhatsApp/Facebook Link Previews
router.get('/share/:id', async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).send('News not found');

    const frontendUrl = 'https://www.mujungavuparthasarathi.in';
    const articleUrl = `${frontendUrl}/news/${newsItem._id}`;
    
    // Choose Kannada by default for the preview since the user requested it
    const title = newsItem.generatedTitle?.kn || newsItem.adminTitle;
    const blurb = newsItem.generatedBlurb?.kn || newsItem.adminDescription;
    const imageUrl = newsItem.imageUrl || `${frontendUrl}/logo.png`;

    const html = `
<!DOCTYPE html>
<html lang="kn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${blurb}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:site_name" content="Sri Parthasarathi Temple Mujungavu" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${articleUrl}" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${blurb}" />
    <meta property="twitter:image" content="${imageUrl}" />

    <!-- Redirect Real Users -->
    <meta http-equiv="refresh" content="0; url=${articleUrl}">
    <script>window.location.replace("${articleUrl}");</script>
</head>
<body>
    <p>Redirecting to <a href="${articleUrl}">Sri Parthasarathi Temple</a>...</p>
</body>
</html>`;

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
    
    const prompt = `You are an expert news editor for a traditional Hindu temple, Sri Parthasarathi Temple in Mujungavu. 
Your tone must be "Devotional and traditional, formal and journalistic".
I will provide you with a basic title and a short description of an upcoming event or news. 
Please generate a structured JSON output containing translations in BOTH English (en) and Kannada (kn) for each field:
{
  "title": { "en": "Eng title", "kn": "Kannada title" },
  "blurb": { "en": "Short 2 sentence description in Eng", "kn": "Short description in Kannada" },
  "content": { "en": "<p>Full HTML body...</p>", "kn": "<p>Full HTML body in Kannada...</p>" }
}

Here is the input:
Title: ${adminTitle}
Description: ${adminDescription}

Return only raw JSON. Do not include markdown code block backticks around the JSON. Your response must be parseable by JSON.parse().`;

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
      
      // FALLBACK MOCK RESPONSE for testing UI when API fails (e.g. invalid key or 403)
      console.log('Falling back to mock generated content (with dynamic translation)...');
      
      const translate = async (text) => {
        try {
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=kn&dt=t&q=${encodeURIComponent(text)}`;
          const res = await fetch(url);
          const data = await res.json();
          return data[0].map(item => item[0]).join('');
        } catch (err) {
          return text;
        }
      };

      const translatedTitle = await translate(adminTitle);
      const translatedDescription = await translate(adminDescription);

      const mockResponse = {
        title: { 
          en: `Devotional Celebration: ${adminTitle}`, 
          kn: `ಭಕ್ತಿ ಸಂಭ್ರಮ: ${translatedTitle}` 
        },
        blurb: { 
          en: `Join us for the auspicious ${adminTitle}. ${adminDescription} Experience the divine grace and traditional rituals at our historic temple.`, 
          kn: `ನಮ್ಮ ಐತಿಹಾಸಿಕ ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದಲ್ಲಿ ನಡೆಯುವ ಈ ಮಂಗಳಕರ ಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಿ. ${translatedDescription} ದೈವಿಕ ಅನುಗ್ರಹ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಆಚರಣೆಗಳನ್ನು ಅನುಭವಿಸಲು ಎಲ್ಲರಿಗೂ ಆದರದ ಸ್ವಾಗತ.` 
        },
        content: { 
          en: `<h3>Auspicious Occasion at Sri Parthasarathi Temple</h3><p>We invite all devotees to partake in the upcoming <strong>${adminTitle}</strong>. ${adminDescription}</p><p>This sacred event is a time-honored tradition at our beloved Mujungavu temple. The priests will be performing special poojas and rituals to invoke the blessings of Lord Parthasarathi.</p><p>We look forward to welcoming you and your family. May the divine grace be with you.</p>`, 
          kn: `<h3>ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದಲ್ಲಿ ಶುಭ ಸಂದರ್ಭ</h3><p>ಮುಂಬರುವ <strong>${translatedTitle}</strong> ಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ಪಾಲ್ಗೊಳ್ಳಲು ನಾವು ಎಲ್ಲಾ ಭಕ್ತರನ್ನು ಆಹ್ವಾನಿಸುತ್ತೇವೆ. ${translatedDescription}</p><p>ಈ ಪವಿತ್ರ ಘಟನೆಯು ನಮ್ಮ ನೆಚ್ಚಿನ ಮುಜುಂಗಾವು ದೇವಸ್ಥಾನದಲ್ಲಿ ಕಾಲಾನಂತರದ ಸಂಪ್ರದಾಯವಾಗಿದೆ. ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿಯ ಆಶೀರ್ವಾದ ಪಡೆಯಲು ಅರ್ಚಕರು ವಿಶೇಷ ಪೂಜೆ ಮತ್ತು ವಿಧಿವಿಧಾನಗಳನ್ನು ನೆರವೇರಿಸಲಿದ್ದಾರೆ.</p><p>ಈ ಶುಭ ಸಂದರ್ಭದಲ್ಲಿ ಎಲ್ಲರಿಗೂ ಆದರದ ಸ್ವಾಗತ. ದಯವಿಟ್ಟು ಭಾಗವಹಿಸಿ ಶ್ರೀ ದೇವರ ಆಶೀರ್ವಾದ ಪಡೆಯಿರಿ. ದೈವಿಕ ಅನುಗ್ರಹವು ನಿಮ್ಮೊಂದಿಗಿರಲಿ.</p>` 
        }
      };
      
      return res.json(mockResponse);
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

    // Send Push Notifications for News
    if (saved.status === 'published') {
      try {
        const Subscription = require('../models/Subscription');
        const webpush = require('web-push');
        const frontendUrl = 'https://www.mujungavuparthasarathi.in';
        
        // Use Kannada title if available, else English admin title
        const newsTitle = saved.generatedTitle?.kn || saved.adminTitle;
        const payload = JSON.stringify({
          title: 'ಹೊಸ ಸುದ್ದಿ (New Update)',
          body: newsTitle,
          url: `${frontendUrl}/news/${saved._id}`
        });
        
        const subscriptions = await Subscription.find();
        const pushPromises = subscriptions.map(sub => 
          webpush.sendNotification(sub, payload).catch(err => {
            if (err.statusCode === 410 || err.statusCode === 404) {
              return Subscription.findByIdAndDelete(sub._id);
            }
          })
        );
        await Promise.all(pushPromises);
      } catch (pushErr) {
        console.error('Push notification error for news:', pushErr);
      }
    }

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
