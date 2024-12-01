import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination } from "swiper/modules";
import "./Community.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import { notification } from "antd";
import { useMovieContext } from "../../Context/MoviesContext";
import instance from "../../server";
interface Rating {
  id: number;
  user: { avatar: string };
  user_name: string;
  rating: number;
  movie_name: string;
}
const Community: React.FC = () => {
  const { state: { movies } } = useMovieContext();
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [visibleRatings, setVisibleRatings] = useState(5);
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await instance.get("/rating");
        setRatings(response.data.data);
      } catch {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải dữ liệu đánh giá.",
        });
      }
    };
    fetchRatings();
  }, []);

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
      if (favorites[movieId]) {
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
      setFavorites((prev) => ({ ...prev, [movieId]: !prev[movieId] }));
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý yêu thích phim.",
      });
    }
  };
  const handleShowMore = () => {
    setVisibleRatings((prev) => prev + 5); // Mỗi lần nhấn tăng thêm 5 đánh giá
  };

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

        <Swiper
          spaceBetween={10}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="movieList"
          breakpoints={{
            1024: { slidesPerView: 7 },
            768: { slidesPerView: 5 },
            390: { slidesPerView: 2 },
          }}
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div className="movieCard">
                <img src={movie.poster || ""} alt={movie.movie_name} className="movieImage" />
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
        <div className="danh-sach-hoat-dong">
          <h2 className="tieu-de">Moveek-er đang làm gì?</h2>
          {ratings.slice(0, visibleRatings).map((rating) => (
            <div className="hoat-dong-item" key={rating?.id}>
              <div className="avatar-container">
                <img src={rating.user.avatar} alt="Avatar" className="avatar" />
              </div>
              <div className="noi-dung">
                <strong>{rating.user_name}</strong> đã đánh giá
                <span className="danh-gia"> {rating.rating} ⭐</span> cho
                <strong> {rating.movie_name}</strong>
              </div>
            </div>
          ))}
          {visibleRatings < ratings.length && (
            <button className="xem-them" onClick={handleShowMore}>
              Xem thêm
            </button>
          )}
        </div>

        <div className="phe-binh-chuyen-nghiep">
          <h3>Moveek's Approved Critics</h3>
          <ul className="danh-sach-phe-binh">
          {ratings.slice(0, visibleRatings).map((rating) => (
            <li className="phe-binh-item" key={rating?.id}>
            <img src={rating.user.avatar} alt="Avatar" className="avatar" />
            <div className="thong-tin">
              <div className="ten">{rating.user_name}</div>
              {/* <div className="mo-ta">{critic.description}</div> */}
            </div>
          </li>
              ))}
              {visibleRatings < ratings.length && (
                <button className="xem-them" onClick={handleShowMore}>
                  Xem thêm
                </button>
              )}
           
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Community;
