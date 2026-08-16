const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const Subscription = require('../models/Subscription');

// Set VAPID details
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(
    'mailto:test@test.com',
    publicVapidKey,
    privateVapidKey
  );
}

// Get VAPID public key
router.get('/vapidPublicKey', (req, res) => {
  res.json({ publicKey: publicVapidKey });
});

// Subscribe to push notifications
router.post('/subscribe', async (req, res) => {
  const subscription = req.body;
  
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription object' });
  }

  try {
    // Upsert subscription
    await Subscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      subscription,
      { upsert: true, new: true }
    );
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Subscription error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

module.exports = router;
