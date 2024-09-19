import React, { useState } from 'react';
import './NewsAndReview.css';

const NewsAndReview = () => {
  return (
    <div className='new-container'>
      {/* News Section */}
      <div className="news-section">
        <h2>Mới cập nhật</h2>
        <div className="news-item">
          <img className="news-image-placeholder" src='https://cdn.moveek.com/storage/media/cache/small/66cea385df92a101936911.jpg'/>
          <div className="news-content">
            <h3>Hoài Linh cùng 'con trai' Tuấn Trần tại họp báo ra mắt Làm Giàu Với Ma</h3>
            <p>Sau thời gian dài chờ đợi, Làm Giàu Với Ma đã chính thức có buổi công chiếu ra mắt khán giả...</p>
            <span className="category">Tin điện ảnh</span> - <span className="time">10 giờ trước</span>
          </div>
        </div>
        
        <div className="news-item">
        <img className="news-image-placeholder" src='https://cdn.moveek.com/storage/media/cache/small/66cea385df92a101936911.jpg'/>
          <div className="news-content">
            <h3>CÁC TÁC PHẨM GIẢI TRÍ TỪ ĐỀ TÀI VÕ HIỆP LIỆU CÒN THU HÚT GIỚI TRẺ?</h3>
            <p>Cùng với sự thay đổi của công nghệ và điều kiện sống, sở thích và xu hướng giải trí...</p>
            <span className="category">Moveek</span> - <span className="time">4 ngày trước</span>
          </div>
        </div>
        
        <div className="news-item">
        <img className="news-image-placeholder" src='https://cdn.moveek.com/storage/media/cache/small/66cea385df92a101936911.jpg'/>
          <div className="news-content">
            <h3>Thám Tử Kiên - Victor Vũ trở lại với thể loại kinh dị trinh thám</h3>
            <p>Đạo diễn Victor Vũ trở lại cùng thể loại hình thám tử Kiên và các nhân vật chính họp báo...</p>
            <span className="category">Tin điện ảnh</span> - <span className="time">6 ngày trước</span>
          </div>
        </div>
        <div className="news-item">
        <img className="news-image-placeholder" src='https://cdn.moveek.com/storage/media/cache/small/66cea385df92a101936911.jpg'/>
          <div className="news-content">
            <h3>Thám Tử Kiên - Victor Vũ trở lại với thể loại kinh dị trinh thám</h3>
            <p>Đạo diễn Victor Vũ trở lại cùng thể loại hình thám tử Kiên và các nhân vật chính họp báo...</p>
            <span className="category">Tin điện ảnh</span> - <span className="time">6 ngày trước</span>
          </div>
        </div>
        <div className="news-item">
        <img className="news-image-placeholder" src='https://cdn.moveek.com/storage/media/cache/small/66cea385df92a101936911.jpg'/>
          <div className="news-content">
            <h3>Thám Tử Kiên - Victor Vũ trở lại với thể loại kinh dị trinh thám</h3>
            <p>Đạo diễn Victor Vũ trở lại cùng thể loại hình thám tử Kiên và các nhân vật chính họp báo...</p>
            <span className="category">Tin điện ảnh</span> - <span className="time">6 ngày trước</span>
          </div>
        </div>
        <div className="news-item">
        <img className="news-image-placeholder" src='https://cdn.moveek.com/storage/media/cache/small/66cea385df92a101936911.jpg'/>
          <div className="news-content">
            <h3>Thám Tử Kiên - Victor Vũ trở lại với thể loại kinh dị trinh thám</h3>
            <p>Đạo diễn Victor Vũ trở lại cùng thể loại hình thám tử Kiên và các nhân vật chính họp báo...</p>
            <span className="category">Tin điện ảnh</span> - <span className="time">6 ngày trước</span>
          </div>
        </div>
        <button className='load-more-btn'>Xem Thêm</button>
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
