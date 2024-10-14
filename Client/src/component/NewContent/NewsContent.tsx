import  { useEffect, useState } from 'react';
import Slider from 'react-slick';
import instance from '../../server';
import './NewsContent.css'; 
import { NewsItem } from '../../interface/NewsItem';

const NewsContent = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get('/news');
        if (Array.isArray(response.data.data)) {
          setNewsData(response.data.data);
        } else {
          console.error("Expected an array in 'data', but received:", typeof response.data.data);
        }
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    };
    fetchData();
  }, []);

  

  // Display main news (first news item)
  const mainNews = newsData[0];

  return (
    <div className="news-container">
      <div className="main-news">
        <div className="main-news-image">
          <Slider {...settings}>
            {newsData.slice(0, 3).map((news, index) => (
              <div key={index}>
                <img src={news.banner || 'https://via.placeholder.com/800x400'} alt={news.title} />
              </div>
            ))}
          </Slider>
        </div>
        <div className="main-news-content">
          <h2 className='PhimHot'>Phim Hot Trong Tuần</h2>
          {/* <p className="category">
            TV Series • {mainNews.user_id} • {new Date(mainNews.created_at).toLocaleString()}
          </p>
          <p className="description">{mainNews.content}</p> */}
        </div>
      </div>

      <div className="related-news">
        {newsData.slice(1, 6).map((news, index) => (
          <div className="related-news-item" key={index}>
            <a href="#" className='title'>{news.title}</a>
            <span className="author">{news.user_id} • {new Date(news.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsContent;
