import React from 'react';
import './Reviews.css';
import { useLanguage } from '../context/LanguageContext';
import { Star } from 'lucide-react';

const reviewsData = [
  {
    id: 1,
    name: "Shyam Sundar",
    rating: 5,
    text: "A very peaceful and ancient temple. The pond is beautiful and the atmosphere is very divine. Must visit place for peace of mind.",
    time: "2 months ago"
  },
  {
    id: 2,
    name: "Aswathi Nair",
    rating: 5,
    text: "Very powerful deity. The priests are very friendly and explain the history well. Taking a dip in the holy lake is a must.",
    time: "3 months ago"
  },
  {
    id: 3,
    name: "Ramesh Bhat",
    rating: 5,
    text: "Historical temple with great architecture. It's so quiet and serene here, completely away from the city noise. Lord Parthasarathi's idol is majestic.",
    time: "4 months ago"
  },
  {
    id: 4,
    name: "Divya K",
    rating: 5,
    text: "One of the oldest temples in Kasaragod. The poojas are done with utmost devotion. The vibe here is just unexplainable.",
    time: "5 months ago"
  },
  {
    id: 5,
    name: "Prakash Shetty",
    rating: 5,
    text: "Blessed to visit this holy place. The natural beauty surrounding the temple and the holy Kaveri Theertha lake make it a perfect spiritual retreat.",
    time: "6 months ago"
  }
];

function Reviews() {
  const { t } = useLanguage();

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
      <div className="container">
        <h2 className="section-title animate-on-scroll">{t('reviews', 'title')}</h2>
        <p className="gallery-subtitle animate-on-scroll text-center" style={{ transitionDelay: '0.1s' }}>
          {t('reviews', 'subtitle')}
        </p>
      </div>

      <div className="reviews-scroll-container animate-on-scroll">
        <div className="reviews-marquee-track">
          {/* First set of reviews */}
          {reviewsData.map((review) => (
            <div key={`set1-${review.id}`} className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar">
                  {review.name.charAt(0)}
                </div>
                <div className="reviewer-info">
                  <h4>{review.name}</h4>
                  <span className="review-time">{review.time}</span>
                </div>
              </div>
              <StarRating rating={review.rating} />
              <p className="review-text">{review.text}</p>
            </div>
          ))}

          {/* Duplicated set of reviews for infinite scrolling */}
          {reviewsData.map((review) => (
            <div key={`set2-${review.id}`} className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar">
                  {review.name.charAt(0)}
                </div>
                <div className="reviewer-info">
                  <h4>{review.name}</h4>
                  <span className="review-time">{review.time}</span>
                </div>
              </div>
              <StarRating rating={review.rating} />
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

export default Reviews;
