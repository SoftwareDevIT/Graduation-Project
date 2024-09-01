import React from "react";
import "./NewsContent.css";

const NewsContent = () => {
  return (
    <div className="news-container">
      <div className="main-news">
        <div className="main-news-image">
          <img src="https://cdn.moveek.com/storage/media/cache/large/66ceaadf0b3b1511942043.jpg" alt="Main news" />
        </div>
        <div className="main-news-content">
          <h2>9 phim Netflix đáng xem nhất tháng 9 năm 2024</h2>
          <p className="category">TV Series • linhhuynh0257 • 3 giờ trước</p>
          <p className="description">
            Như thường lệ cứ mỗi tháng Netflix lại gỡ một số phim cũ và lên
            nhiều phim mới, hấp dẫn. Danh sách phim Netflix dưới đây sẽ mang
            đến cho bạn những tựa phim đáng chú ý nhất.
          </p>
        </div>
      </div>

      <div className="related-news">
        <ul>
          <li>
            <a href="#">Hai Muối và Làm Giàu Với Ma – 2 bộ phim Việt trình làng dịp lễ Quốc khánh 2/9</a>
            <span className="author">miduynph • 11 giờ trước</span>
          </li>
          <li>
            <a href="#">List phim anime 18+ 'cực đỉnh' trên Netflix</a>
            <span className="author">vntduyen • 1 ngày trước</span>
          </li>
          <li>
            <a href="#">Thấy gì về thành công của Ma Da và Quý Cậu?</a>
            <span className="author">Ivy_Trat • 2 ngày trước</span>
          </li>
          <li>
            <a href="#">Đã Nữ Báo Thù (Revolver) – Đừng dại mà thất hứa với phụ nữ!</a>
            <span className="author">linhhuynh0257 • 4 ngày trước</span>
          </li>
          <li>
            <a href="#">Giải mã sức hút của Shin Cậu Bé Bút Chì: Nhật Ký Khủng Long Của Chúng Mình</a>
            <span className="author">miduynph • 4 ngày trước</span>
          </li>
          <li>
            <a href="#">Jeon Do Yeon – Ji Chang Wook – Lim Ji Yeon bộ ba sao hạng A hội ngộ trong Đã Nữ Báo Thù</a>
            <span className="author">miduynph • 6 ngày trước</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NewsContent;
