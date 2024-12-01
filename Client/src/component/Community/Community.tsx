import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper
import "swiper/css"; // Import Swiper basic CSS
import "swiper/css/pagination"; // Import pagination CSS
import "swiper/css/navigation"; // Import navigation CSS
import { Pagination } from "swiper/modules";
import './Community.css';
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import { notification } from "antd";
import { useMovieContext } from "../../Context/MoviesContext";
import instance from "../../server";

const Community: React.FC = () => {
    const { state: { movies } } = useMovieContext();
    const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  

    const handleFavoriteToggle = async (movieId: string | number) => {
      const token = localStorage.getItem("token");
      if (!token) {
        notification.warning({
          message: "Yêu cầu đăng nhập",
          description: "Vui lòng đăng nhập để thêm phim vào danh sách yêu thích!",
        });
        return;
      }
    
      try {
        if (favorites[movieId]) { // favorites[movieId.toString()] nếu lưu trữ với khóa chuỗi
          await instance.delete(`/favorites/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          notification.success({
            message: "Xóa khỏi yêu thích thành công",
            description: "Phim đã được xóa khỏi danh sách yêu thích!",
          });
        } else {
          await instance.post(`/favorites/${movieId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          notification.success({
            message: "Thêm vào yêu thích thành công",
            description: "Phim đã được thêm vào danh sách yêu thích!",
          });
        }
    
        setFavorites((prev) => ({
          ...prev,
          [movieId]: !prev[movieId],
        }));
      } catch {
        notification.error({
          message: "Lỗi",
          description: "Có lỗi xảy ra khi xử lý yêu thích phim.",
        });
      }
    };
    
  const activities = [
    { user: "Lương Thành Tuấn", rating: 10, movie: "Linh Miêu: Quỷ Nhập Tràng", time: "3 giờ trước" },
    { user: "Quốc Quang", rating: 5, movie: "Quỷ Treo Đầu", time: "4 giờ trước" },
    { user: "Nguyễn Minh Tuấn", rating: 1, movie: "Chiến Địa Tử Thi", time: "6 giờ trước" },
  ];

  const critics = [
    { avatar: "https://via.placeholder.com/50", name: "Bùi An", description: "Phóng viên (HDVietnam)" },
    { avatar: "https://via.placeholder.com/50", name: "Đào Bội Tú", description: "Phê bình phim tự do" },
    { avatar: "https://via.placeholder.com/50", name: "Đào Diệu Loan", description: "Phóng viên tự do" },
    { avatar: "https://via.placeholder.com/50", name: "Gwens Nghé", description: "Phê bình - phân tích phim" },
  ];

  return (
    <>
      <Header />
      <div className="trendingMovies">
        <h1 className="heading">Thịnh hành</h1>
        <p className="subheading">Các phim được yêu thích trong tuần</p>

        {/* Sử dụng Swiper Slider */}
        <Swiper
          spaceBetween={10}
          pagination={{ clickable: true }}
          modules={[Pagination]} // Correct import for Pagination
          className="movieList"
          breakpoints={{
            1024: {
              slidesPerView: 7,
            },
            768: {
              slidesPerView: 5,
            },
            390: {
              slidesPerView: 2,
            },
          }}
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={index}>
              <div className="movieCard">
                <img src={movie.poster||""} alt={movie.movie_name} className="movieImage" />
                <div
              className={`heartIcon ${favorites[movie.id] ? "active" : ""}`}
              onClick={() => handleFavoriteToggle(movie.id)}
            ></div>
                <p className="movieTitle">{movie.movie_name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="hoat-dong-moi">
        {/* Danh sách hoạt động mới */}
        <div className="danh-sach-hoat-dong">
          <h2 className="tieu-de">Moveek-er đang làm gì?</h2>
          {activities.map((activity, index) => (
            <div className="hoat-dong-item" key={index}>
              <div className="avatar-container">
                <img src="https://via.placeholder.com/50" alt="Avatar" className="avatar" />
              </div>
              <div className="noi-dung">
                <strong>{activity.user}</strong> đã đánh giá 
                <span className="danh-gia">{activity.rating} ⭐</span> cho 
                <strong> {activity.movie}</strong>
              </div>
              <div className="thoi-gian">{activity.time}</div>
            </div>
          ))}
        </div>

        {/* Danh sách phê bình chuyên nghiệp */}
        <div className="phe-binh-chuyen-nghiep">
          <div className="tieu-de-phu">
            <h3>Moveek's Approved Critics</h3>
          </div>
          <ul className="danh-sach-phe-binh">
            {critics.map((critic, index) => (
              <li className="phe-binh-item" key={index}>
                <img src={critic.avatar} alt="Avatar" className="avatar" />
                <div className="thong-tin">
                  <div className="ten">{critic.name}</div>
                  <div className="mo-ta">{critic.description}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Community;
