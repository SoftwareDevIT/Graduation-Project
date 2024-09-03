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
            Rạp <span className="arrow">&#9662;</span>
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
            Phim <span className="arrow">&#9662;</span>
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
            Tin Tức <span className="arrow">&#9662;</span>
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
        <img
          src="https://img.icons8.com/ios-filled/50/000000/marker.png"
          alt="Location"
          className="icon icon-location"
        />
        <img
          src="https://img.icons8.com/ios-filled/50/000000/help.png"
          alt="Support"
          className="icon icon-support"
        />
        <img
          src="https://img.icons8.com/ios-filled/50/000000/user-male-circle.png"
          alt="User"
          className="icon icon-user"
        />
      </div>
    </header>
  );
};
export default Header;
