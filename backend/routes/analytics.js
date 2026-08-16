const express = require('express');
const router = express.Router();
const PageView = require('../models/PageView');
const auth = require('../middleware/auth');

// POST /api/analytics/track
// Public endpoint for frontend to record a page view
router.post('/track', async (req, res) => {
  try {
    const { path } = req.body;
    if (!path) return res.status(400).json({ error: 'Path is required' });

    const newView = new PageView({
      path: path,
      userAgent: req.headers['user-agent'] || 'Unknown'
    });

    await newView.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Failed to track analytics:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET /api/analytics/stats
// Protected endpoint for admin panel to fetch visit counts
router.get('/stats', auth, async (req, res) => {
  try {
    const now = new Date();
    
    // Total Visitors
    const totalVisitors = await PageView.countDocuments();
    
    // Visitors Today (from midnight)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const visitorsToday = await PageView.countDocuments({ timestamp: { $gte: startOfToday } });
    
    // Visitors over the last 7 days (grouped by day)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    
    const dailyData = await PageView.aggregate([
      {
        $match: { timestamp: { $gte: sevenDaysAgo } }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          visits: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Format the daily data nicely for recharts
    // Create an array of the last 7 days and fill in zeroes for days with no visits
    const last7DaysChart = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      
      const found = dailyData.find(day => day._id === dateString);
      last7DaysChart.push({
        date: dateString,
        visits: found ? found.visits : 0
      });
    }

    res.json({
      totalVisitors,
      visitorsToday,
      chartData: last7DaysChart
    });
  } catch (err) {
    console.error('Failed to get analytics stats:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
