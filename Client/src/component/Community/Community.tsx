
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

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await instance.get("/user", {
            
          });
  console.log('phim:',response)
          const favoriteMovies = response.data.favorite_movies.reduce(
            (acc: { [key: string]: boolean }, movie: any) => {
              acc[movie.id] = true;
              return acc;
            },
            {}
          );
  
          setFavorites(favoriteMovies); // Cập nhật danh sách yêu thích
        } catch (error) {
          console.error("Lỗi tải danh sách yêu thích:", error);
        }
      }
    };
  
    fetchFavorites();
  }, []);
  


  
  const handleFavoriteToggle = async (movieId: number) => {
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
        // Xóa khỏi danh sách yêu thích
        await instance.delete(`/favorites/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        notification.success({
          message: "Thành công",
          description: "Phim đã được xóa khỏi danh sách yêu thích!",
        });
      } else {
        // Thêm vào danh sách yêu thích
        await instance.post(`/favorites/${movieId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        notification.success({
          message: "Thành công",
          description: "Phim đã được thêm vào danh sách yêu thích!",
        });
      }
  
      setFavorites((prev) => ({ ...prev, [movieId]: !prev[movieId] }));
    } catch (error) {
      console.error("Lỗi xử lý yêu thích phim:", error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý yêu thích phim.",
      });
    }
  };
  
  
  const handleShowMore = () => {
    setVisibleRatings((prev) => prev + 5); // Mỗi lần nhấn tăng thêm 5 đánh giá
  };


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
          <h2 className="tieu-de">FlickHive-er đang làm gì?</h2>
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
          <h3>FlickHive's Approved Critics</h3>
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

