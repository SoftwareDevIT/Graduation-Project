import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { stripHtml } from '../../assets/Font/quillConfig';

import './NewsAndReview.css';
import { useNews } from '../../Context/NewsContext';

const NewsAndReview = () => {
  const { newsData, reviewsData, isLoading, error } = useNews()
  const [visibleItems, setVisibleItems] = useState(5);
  const [showAll, setShowAll] = useState(false);

  const handleToggleItems = () => {
    setVisibleItems(showAll ? 5 : newsData.length);
    setShowAll(!showAll);
  };

  

  return (
    <div className="new-container">
      <div className="news-section">
        <div className="Capnhat">
          <h2>Mới cập nhật</h2>
        </div>
        {newsData.slice(0, visibleItems).map((news, index) => (
          <div className="news-item" key={index}>
            <img
              className="news-image-placeholder"
              src={news.thumnail || 'https://via.placeholder.com/150'}
              alt={news.title}
            />
            <div className="news-content">
              <Link to={`/postdetail/${news.id}`}>
                <h3>{news.title}</h3>
              </Link>
              <span>{news.user.fullname}</span>
              <p>{stripHtml(news.content.substring(0, 100))}...</p>
            </div>
          </div>
        ))}
        {newsData.length > 5 && (
          <button className="load-more-btn" onClick={handleToggleItems}>
            {showAll ? 'Ẩn bớt' : 'Xem Thêm'}
          </button>
        )}
      </div>
      <div className="review-section">
      <h2>Review</h2>
        {reviewsData.slice(-5).map((review, index) => ( // Lấy 5 mục cuối
          <div className="review-item" key={index}>
             <Link to={`/postdetail/${review.id}`}>
                <h3>{review.title}</h3>
              </Link>
            <span className="time">{review.user.fullname}• {new Date(review.created_at).toLocaleDateString()}</span>  
            
          </div>
        ))}
      </div>
    </div>
 
  );
};

export default NewsAndReview;
