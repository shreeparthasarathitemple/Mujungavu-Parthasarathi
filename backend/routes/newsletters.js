const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const auth = require('../middleware/auth');

// Public route to subscribe
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }

  try {
    let subscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (subscriber) {
      if (!subscriber.isActive) {
        subscriber.isActive = true;
        await subscriber.save();
        return res.json({ message: 'Successfully re-subscribed!' });
      }
      return res.status(400).json({ message: 'You are already subscribed!' });
    }

    subscriber = new Newsletter({ email });
    await subscriber.save();
    res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
  } catch (err) {
    console.error('Subscription error:', err);
    res.status(500).json({ message: 'Server error during subscription' });
  }
});

// Admin routes below
// Get all subscribers
router.get('/subscribers', auth, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a subscriber
router.delete('/subscribers/:id', auth, async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Send newsletter (simulated for now, could be integrated with SendGrid/Nodemailer)
router.post('/send', auth, async (req, res) => {
  const { subject, htmlContent } = req.body;
  
  if (!subject || !htmlContent) {
    return res.status(400).json({ message: 'Subject and content are required' });
  }

  try {
    const activeSubscribers = await Newsletter.find({ isActive: true });
    
    if (activeSubscribers.length === 0) {
      return res.status(400).json({ message: 'No active subscribers found' });
    }

    // Here you would integrate with an email provider
    // Example: await emailService.sendBulk(activeSubscribers.map(s => s.email), subject, htmlContent);
    
    // Simulating sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({ 
      message: `Newsletter sent successfully to ${activeSubscribers.length} subscribers!`,
      sentCount: activeSubscribers.length 
    });
  } catch (err) {
    console.error('Send newsletter error:', err);
    res.status(500).json({ message: 'Failed to send newsletter' });
  }
});

module.exports = router;
