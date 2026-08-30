import React, { useState, useEffect } from 'react';
import './Reviews.css';
import { useLanguage } from '../context/LanguageContext';
import { Star } from 'lucide-react';

function Reviews() {
  const { t } = useLanguage();
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`);
        const data = await response.json();
        if (data && data.length > 0) {
          setReviewsData(data);
        } else {
          // Fallback static data if API key not set or fetch fails
          setReviewsData([
            { id: 1, name: "Shyam Sundar", rating: 5, text: "A very peaceful and ancient temple. The pond is beautiful and the atmosphere is very divine. Must visit place for peace of mind.", time: "2 months ago", profile_photo_url: null },
            { id: 2, name: "Aswathi Nair", rating: 5, text: "Very powerful deity. The priests are very friendly and explain the history well. Taking a dip in the holy lake is a must.", time: "3 months ago", profile_photo_url: null },
            { id: 3, name: "Ramesh Bhat", rating: 5, text: "Historical temple with great architecture. It's so quiet and serene here, completely away from the city noise. Lord Parthasarathi's idol is majestic.", time: "4 months ago", profile_photo_url: null },
            { id: 4, name: "Divya K", rating: 5, text: "One of the oldest temples in Kasaragod. The poojas are done with utmost devotion. The vibe here is just unexplainable.", time: "5 months ago", profile_photo_url: null }
          ]);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const StarRating = ({ rating }) => {
    return (
      <div className="flex text-yellow-400 mb-2" style={{ display: 'flex' }}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill={i < rating ? "currentColor" : "none"} stroke="currentColor" />
        ))}
      </div>
    );
  };

  return (
    <section className="section reviews-section" id="reviews">
      <video 
        className="reviews-video-bg" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        {/* User will provide the video link for this source */}
        <source src="https://aingapwqyhtvjygwtiat.supabase.co/storage/v1/object/sign/videos/lake.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZDI3ODZmMS1iNmU5LTRlZGYtOWIzNy0zOWJjM2Q0YmU4MDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvbGFrZS5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2ODk5NTAxLCJleHAiOjE4MTg0MzU1MDF9.9G7VHsOIZ7wstyFEIWYF0WH60E_TZIPiYGeNx4iwh08" type="video/mp4" />
      </video>
      <div className="reviews-overlay"></div>

      <div className="container">
        <h2 className="section-title animate-on-scroll">{t('reviews', 'title')}</h2>
        <p className="gallery-subtitle animate-on-scroll text-center" style={{ transitionDelay: '0.1s' }}>
          {t('reviews', 'subtitle')}
        </p>
      </div>

      <div className="container" style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
        <a 
          href="https://search.google.com/local/writereview?placeid=ChIJh-blvnCdpDsR9flkvXaQS_Y" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="google-review-btn animate-on-scroll"
        >
          <img src="/google-logo.svg" alt="Google Logo" style={{ width: 18, height: 18 }} />
          Write a Review
        </a>
      </div>

      <div className="reviews-scroll-container animate-on-scroll">
        {!loading && (
          <div className="reviews-marquee-track">
            {/* Set of reviews */}
            {reviewsData.map((review) => (
              <div key={`set1-${review.id}`} className="review-card glassmorphism-card">
                <div className="review-header">
                  <div className="reviewer-avatar">
                    {review.profile_photo_url ? (
                      <img src={review.profile_photo_url} alt={review.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    ) : (
                      review.name.charAt(0)
                    )}
                  </div>
                  <div className="reviewer-info">
                    <h4>{review.name}</h4>
                    <span className="google-review-label">
                      <img src="/google-logo.svg" alt="Google Logo" />
                      Google Review
                    </span>
                  </div>
                </div>
                <StarRating rating={review.rating} />
                <p className="review-text">"{review.text}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
  );
}

export default Reviews;
