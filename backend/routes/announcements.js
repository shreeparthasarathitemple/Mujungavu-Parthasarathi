const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');

// Get all announcements (Admin)
router.get('/all', auth, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all active announcements (Public)
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Share announcement (Returns HTML for social crawlers)
router.get('/share/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).send('Announcement not found');
    
    const frontendUrl = process.env.FRONTEND_URL || 'https://www.mujungavuparthasarathi.in';
    const redirectUrl = req.query.redirect || `${frontendUrl}/a/${announcement._id}`;
    const title = announcement.title;
    const description = announcement.content ? announcement.content.substring(0, 150) + '...' : 'Sri Parthasarathi Temple Announcement';
    const imageUrl = announcement.imageUrl || 'https://www.mujungavuparthasarathi.in/logo.png';

    const currentUrl = `${req.protocol}://${req.get('host')}/api/announcements/share/${announcement._id}`;
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${title} | Sri Parthasarathi Temple</title>
        <!-- Open Graph / Facebook / WhatsApp -->
        <meta property="og:type" content="article">
        <meta property="og:url" content="${currentUrl}">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:site_name" content="Sri Parthasarathi Temple">
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="${currentUrl}">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:description" content="${description}">
        <meta name="twitter:image" content="${imageUrl}">
        
        <script>
          // Redirect for human visitors (crawlers typically don't run JS)
          window.location.href = "${redirectUrl}";
        </script>
      </head>
      <body>
        <p>Redirecting to announcement... <a href="${redirectUrl}">Click here</a> if not redirected.</p>
      </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get a specific announcement (Public)
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Like an announcement (Public)
router.post('/:id/like', async (req, res) => {
  try {
    const incValue = req.body.action === 'unlike' ? -1 : 1;
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: incValue } },
      { new: true }
    );
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    // Prevent negative likes
    if (announcement.likes < 0) {
      announcement.likes = 0;
      await announcement.save();
    }
    res.json({ likes: announcement.likes });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});



const Subscription = require('../models/Subscription');
const webpush = require('web-push');

// Create announcement (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const newAnnouncement = new Announcement({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });
    await newAnnouncement.save();

    // Send Push Notifications
    try {
      const payload = JSON.stringify({
        title: 'New Temple Announcement!',
        body: newAnnouncement.title,
        url: '/'
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
      console.error('Push notification error:', pushErr);
    }

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
