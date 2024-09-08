import React, { useState } from 'react';
import './MovieBanner.css';
import Slider from 'react-slick';

const MovieBanner = () => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToScroll: 4,
        slidesToShow: 8,
        draggable: true,
        swipe: true, 
        swipeToSlide: true,
        
      };
  return (
    <div className="movie-banner">
      <div className="banner-header">
        <h2>Đang chiếu</h2>|<h2 style={{color: "#95aac9"}}>Sắp chiếu</h2>
      </div>
      <div className="movie-slider">
      <div className="slider-container">
      <Slider {...settings}>
        <div>
        <div className="movie-item">
          <img src="https://cdn.moveek.com/storage/media/cache/short/6684d276139ad087720074.jpg" alt="Ma Da" />
          <div className="movie-info">
            <button className="buy-ticket">Mua vé</button>
            <p>Ma Da</p>
            <span>16/08</span>
            <span className="rating">80%</span>
          </div>
        </div>
        </div>
        <div>
        <div className="movie-item">
          <img src="https://cdn.moveek.com/storage/media/cache/short/66b1a047a14ac186965830.jpg" alt="Đẹp Trai Thật Sai Gái" />
          <div className="movie-info">
            <button className="buy-ticket">Mua vé</button>
            <p>Đẹp Trai Thật...</p>
            <span>09/08</span>
            <span className="rating">98%</span>
          </div>
        </div>
        </div>
        <div>
        <div className="movie-item">
          <img src="https://cdn.moveek.com/storage/media/cache/short/668fa30fa8b81007665610.jpg" alt="Shin Cậu Bé Bút Chì" />
          <div className="movie-info">
            <button className="buy-ticket">Mua vé</button>
            <p>Shin Cậu Bé...</p>
            <span>23/08</span>
            <span className="rating">90%</span>
          </div>
        </div>
        </div>
        <div>
        <div className="movie-item">
          <img src="https://cdn.moveek.com/storage/media/cache/short/66ab461db9c63013081933.jpg" alt="Quái Vật Không Gian" />
          <div className="movie-info">
            <button className="buy-ticket">Mua vé</button>
            <p>Quái Vật Không..</p>
            <span>16/08</span>
            <span className="rating">92%</span>
          </div>
        </div>
        </div>
        <div>
        <div className="movie-item">
          <img src="https://cdn.moveek.com/storage/media/cache/short/66b9b717015a9213503773.jpg" alt="Đã Nữ Báo Thù" />
          <div className="movie-info">
            <button className="buy-ticket">Mua vé</button>
            <p>Đã Nữ Báo Thù</p>
            <span>23/08</span>
            <span className="rating">85%</span>
          </div>
        </div>
        </div>
        <div>
        <div className="movie-item">
          <img src="https://cdn.moveek.com/storage/media/cache/short/6698911a5f5be045010928.jpg" alt="Borderlands" />
          <div className="movie-info">
            <button className="buy-ticket">Mua vé</button>
            <p>Borderlands</p>
            <span>23/08</span>
            <span className="rating">88%</span>
          </div>
        </div>
        </div>
        <div>
        <div className="movie-item">
          <img src="https://cdn.moveek.com/storage/media/cache/short/66c41ad3ba058964206197.jpg" alt="Borderlands" />
          <div className="movie-info">
            <button className="buy-ticket">Mua vé</button>
            <p>Borderlands</p>
            <span>23/08</span>
            <span className="rating">88%</span>
          </div>
        </div>
        </div>
        <div>
        <div className="movie-item">
          <img src="https://cdn.moveek.com/storage/media/cache/short/66c41ad3ba058964206197.jpg" alt="Harold Và Cả Đám Bạn" />
          <div className="movie-info">
            <button className="buy-ticket">Mua vé</button>
            <p>Harold Và Cả...</p>
            <span>23/08</span>
            <span className="rating">90%</span>
          </div>
        </div>
        </div>
        <div>
        <div className="movie-item">
          <img src="https://cdn.moveek.com/storage/media/cache/short/66b2128783a12751181872.png" alt="Âm Dương Sư" />
          <div className="movie-info">
            <button className="buy-ticket">Mua vé</button>
            <p>Âm Dương Sư</p>
            <span>23/08</span>
            <span className="rating">87%</span>
          </div>
        </div> 
        </div>
      </Slider>
    </div>
      </div>
    </div>
    
  );
};

export default MovieBanner;
