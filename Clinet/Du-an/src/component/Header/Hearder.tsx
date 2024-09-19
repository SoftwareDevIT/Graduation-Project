import React from "react";
import "./Hearder.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to={"/muave"} style={{ color: "red", fontWeight: "bold" }}>
          Đặt vé phim chiếu rạp
        </Link>

        <a href="#">Lịch chiếu</a>
        <div className="dropdown">
          <a href="#" className="dropbtn">
            Rạp <span className="arrow"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg></span>
          </a>
          <div className="dropdown-content">
            <input
              type="text"
              placeholder="Tìm rạp tại"
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "12px",
                boxSizing: "border-box",
              }}
            />
            <a href="#">Đống Đa</a>
            <a href="#">Beta Quang Trung</a>
            <a href="#">Beta Trần Quang Khải</a>
            <a href="#">Cinestar Hai Bà Trưng</a>
            <a href="#">Cinestar Quốc Thanh</a>
            <a href="#">DCINE Bến Thành</a>
            <a href="#">Mega GS Cao Thắng</a>
            <a href="#">Mega GS Lý Chính Thắng</a>
            <a href="#">BHD Star 3/2</a>
            <a href="#">BHD Star Lê Văn Việt</a>
          </div>
        </div>
        <div className="dropdown">
          <a href="#" className="dropbtn">
            Phim <span className="arrow"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 6L8 10L12 6" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
          </a>
          <div className="dropdown-content">
            <a href="#">Đang chiếu</a>
            <a href="#">Sắp chiếu</a>
            <a href="#">Chiếu sớm</a>
            <a href="#">Phim Việt Nam</a>
          </div>
        </div>
        <div className="dropdown">
          <a href="#" className="dropbtn">
            Tin Tức <span className="arrow"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 6L8 10L12 6" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span>
          </a>
          <div className="dropdown-content">
            <a href="#">Tin điện ảnh</a>
            <a href="#">Đánh giá phim</a>
            <a href="#">Video</a>
            <a href="#">TV Series</a>
          </div>
        </div>
        <a href="#">Cộng đồng</a>
      </div>
      <div className="header-logo">
        <Link to={"/"}> moveek</Link>
      </div>
      <div className="header-right">
      <input type="text" placeholder="Từ khóa tìm kiếm..." />
      <Link to="/map" className="icon-link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-geo-alt"
            viewBox="0 0 16 16"
          >
            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
          </svg>
        </Link>
        <Link to="/help" className="icon-link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-question-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
          </svg>
        </Link>
          <Link to="/register" className="icon-link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg>
        </Link>
        <span className="thongbao">&#128276;</span>
      </div>
    </header>
  );
};
export default Header;
