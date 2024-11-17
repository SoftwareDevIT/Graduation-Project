import React from 'react';
import './EarlyMovie.css';
import Header from '../Header/Hearder';
import Footer from '../Footer/Footer';

const EarlyMovie: React.FC = () => {
  return (
    <>
    <Header/>
    <div className="movie-card-fullscreen">
      <div className="movie-card-header">
        <h2>Chiếu sớm</h2>
        <p>Danh sách các phim hiện đang chiếu rạp trên toàn quốc. Xem lịch chiếu phim, giá vé tiện lợi, đặt vé nhanh chỉ với 1 bước!</p>
      </div>
      <div className="movie-card-content">
        <div className="movie-card-poster">
          <img src="https://cdn.moveek.com/storage/media/cache/short/6720a415a0baf290618097.jpg" alt="Red One" />
        </div>
        <div className="movie-card-info">
          <h3>Red One: Mật Mã Đỏ</h3>
          <p className="movie-genre">Red One - Comedy, Action, Adventure</p>
          <p className="movie-description">
            Sau khi Ông già Noel (mật danh: Red One) bị bắt cóc, Trưởng An ninh Bắc Cực (Dwayne Johnson) phải hợp tác với thợ săn tiền thưởng khét tiếng nhất thế giới (Chris Evans) trong một nhiệm vụ kịch tính xuyên lục địa để giải cứu Giáng Sinh.
          </p>
          <div className="movie-details1">
  <div className="movie-info1">
    <span className="duration1"><i className="fas fa-clock"></i> 2h5'</span>
    <span className="rating1"><i className="fas fa-user-plus"></i> K</span>
  </div>
  <div className="movie-dates1">
    Khởi chiếu: 08/11 · Chiếu sớm: 07/11
  </div>
</div>



          <div className="movie-actions">
            <button className="btn-info">Thông tin phim</button>
            <button className="btn-trailer">Trailer</button>
            <button className="btn-buy">Mua vé</button>
          </div>
        </div>
      </div>
      <div className="movie-card-content">
        <div className="movie-card-poster">
          <img src="https://cdn.moveek.com/storage/media/cache/short/6720a415a0baf290618097.jpg" alt="Red One" />
        </div>
        <div className="movie-card-info">
          <h3>Red One: Mật Mã Đỏ</h3>
          <p className="movie-genre">Red One - Comedy, Action, Adventure</p>
          <p className="movie-description">
            Sau khi Ông già Noel (mật danh: Red One) bị bắt cóc, Trưởng An ninh Bắc Cực (Dwayne Johnson) phải hợp tác với thợ săn tiền thưởng khét tiếng nhất thế giới (Chris Evans) trong một nhiệm vụ kịch tính xuyên lục địa để giải cứu Giáng Sinh.
          </p>
          <div className="movie-details1">
  <div className="movie-info1">
    <span className="duration1"><i className="fas fa-clock"></i> 2h5'</span>
    <span className="rating1"><i className="fas fa-user-plus"></i> K</span>
  </div>
  <div className="movie-dates1">
    Khởi chiếu: 08/11 · Chiếu sớm: 07/11
  </div>
</div>



          <div className="movie-actions">
            <button className="btn-info">Thông tin phim</button>
            <button className="btn-trailer">Trailer</button>
            <button className="btn-buy">Mua vé</button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default EarlyMovie;
