import React, { useEffect, useState } from 'react';
import instance from '../../server';
import './NewsAndReview.css';
import { NewsItem } from '../../interface/NewsItem';
import { Link } from 'react-router-dom';

const NewsAndReview = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [visibleItems, setVisibleItems] = useState(5); 
  const [showAll, setShowAll] = useState(false); // State to toggle between showing all items or initial set

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('/news');
        setNewsData(response.data.data || []);
        console.log(response);
        
        
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    };

    fetchData();
  }, []);

  const handleToggleItems = () => {
    if (showAll) {
      setVisibleItems(5); // Show only the initial 5 items
    } else {
      setVisibleItems(newsData.length); // Show all items
    }
    setShowAll(!showAll); // Toggle the state
  };

  return (
    <div className='new-container'>
      {/* News Section */}
      <div className="news-section">
        <div className="Capnhat"><h2>Mới cập nhật</h2></div>
        {newsData.slice(0, visibleItems).map((news, index) => (
          <div className="news-item" key={index}>
            <img className="news-image-placeholder" src={news.thumnail || 'https://via.placeholder.com/150'} alt={news.title} />
            <div className="news-content">
              <Link to={`/postdetail/${news.id}`}><h3>{news.title}</h3>
             
              </Link>
              <span>{news.user.fullname}</span>
              <p>{news.content.substring(0, 100)}...</p>
             
            </div>
          </div>
        ))}
        {newsData.length > 5 && (
          <button className='load-more-btn' onClick={handleToggleItems}>
            {showAll ? 'Ẩn bớt' : 'Xem Thêm'}
          </button>
        )}
      </div>
      
      {/* Review Section */}
      <div className="review-section">
        <h2>Review</h2>
        <div className="review-item">
          <h3>Review Borderlands: Trở Lại Pandora – Chuyến phiêu lưu ngắn hà quái đản</h3>
          <span className="time">6 ngày trước</span> - <span className="reviewer">Ivy_Trat</span>
        </div>
        
        <div className="review-item">
          <h3>Review Emily In Paris Mùa 4 Phần 1 – Đoản khúc vui nhộn trong thế giới phù hoa</h3>
          <span className="time">9 ngày trước</span> - <span className="reviewer">linhhuynh0257</span>
        </div>
        
        <div className="review-item">
          <h3>Ma Da – Một câu chuyện ma đáng tiếc nhiều hơn đáng sợ</h3>
          <span className="time">10 ngày trước</span> - <span className="reviewer">Ivy_Trat</span>
        </div>
        {/* Các mục review khác */}
        <div className="review-item">
          <h3>Ma Da – Một câu chuyện ma đáng tiếc nhiều hơn đáng sợ</h3>
          <span className="time">10 ngày trước</span> - <span className="reviewer">Ivy_Trat</span>
        </div>
        <div className="review-item">
          <h3>Ma Da – Một câu chuyện ma đáng tiếc nhiều hơn đáng sợ</h3>
          <span className="time">10 ngày trước</span> - <span className="reviewer">Ivy_Trat</span>
        </div>
        <div className="review-item">
          <h3>Ma Da – Một câu chuyện ma đáng tiếc nhiều hơn đáng sợ</h3>
          <span className="time">10 ngày trước</span> - <span className="reviewer">Ivy_Trat</span>
        </div>
        <div className="review-item">
          <h3>Ma Da – Một câu chuyện ma đáng tiếc nhiều hơn đáng sợ</h3>
          <span className="time">10 ngày trước</span> - <span className="reviewer">Ivy_Trat</span>
        </div>
      </div>
    </div>
  );
};

export default NewsAndReview;
