const express = require('express');
const router = express.Router();

// In-memory cache to prevent hitting Google API rate limits and costs
let cachedReviews = null;
let lastFetchTime = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    // Return empty if API key isn't configured
    if (!apiKey) {
      return res.status(200).json([]);
    }

    // Check cache
    if (cachedReviews && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
      return res.status(200).json(cachedReviews);
    }

    // New Place ID for Sri Parthasarathi Temple Mujungavu
    const placeId = 'ChIJh-blvnCdpDsR9flkvXaQS_Y';
    const googleUrl = `https://places.googleapis.com/v1/places/${placeId}`;

    const response = await fetch(googleUrl, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews'
      }
    });

    const data = await response.json();

    if (data.error) {
      console.error('Google Places API Error:', data.error);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }

    if (data.reviews) {
      // Map New API response format to our frontend format
      const formattedReviews = data.reviews.map((review, index) => {
        return {
          id: index + 1,
          name: review.authorAttribution?.displayName || "Google User",
          rating: review.rating || 5,
          text: review.text?.text || "",
          time: review.relativePublishTimeDescription || "",
          profile_photo_url: review.authorAttribution?.photoUri || null
        };
      });

      // Filter out empty reviews
      const validReviews = formattedReviews.filter(r => r.text && r.text.trim().length > 0);

      // Cache it
      cachedReviews = validReviews;
      lastFetchTime = Date.now();

      return res.status(200).json(validReviews);
    } else {
      return res.status(200).json([]);
    }

  } catch (error) {
    console.error('Error fetching Google Reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
