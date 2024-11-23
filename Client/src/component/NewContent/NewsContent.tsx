import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { stripHtml } from '../../assets/Font/quillConfig';

import './NewsContent.css';
import { useNews } from '../../Context/NewsContext';

const NewsContent = () => {
  const { newsData, isLoading, error } = useNews();

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

 

  return (
    <div className="news-container">
      <div className="main-news">
        <div className="main-news-image">
          <Slider {...settings}>
            {newsData.slice(0, 3).map((news, index) => (
              <div key={index}>
                <Link to={`/postdetail/${news.id}`}>
                  <img src={news.banner || 'https://via.placeholder.com/800x400'} alt={news.title} />
                </Link>
              </div>
            ))}
          </Slider>
        </div>
        <div className="main-news-content">
          <h2 className="PhimHot">Phim Hot Trong Tuần</h2>
        </div>
      </div>
      <div className="related-news">
        {newsData.slice(1, 6).map((news, index) => (
          <div className="related-news-item" key={index}>
            <Link to={`/postdetail/${news.id}`} className="title">
              {stripHtml(news.title)}
            </Link>
            <span className="author">
              {news.user.fullname} • {new Date(news.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsContent;
