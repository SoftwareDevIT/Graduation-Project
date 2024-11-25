import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { notification, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { stripHtml } from '../../assets/Font/quillConfig';
import "./MovieDetail.css";
import Header from "../Header/Hearder";
import { useMovieContext } from "../../Context/MoviesContext";
import instance from "../../server";

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const { state, fetchMovies } = useMovieContext(); // Get state and functions from context
  const [userStatus, setUserStatus] = useState({
    isLoggedIn: false,
    isFavorite: false,
    isRated: false,
    favoriteMovies: [] as any[],
  });
  const [ratingData, setRatingData] = useState({
    rating: 0,
    review: "",
    isModalVisible: false,
  });
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);

  // Fetch movie details from the context's movie state
  const movie = state.movies.find((movie) => movie.id === Number(id));


  useEffect(() => {
    fetchMovies(); // Chỉ gọi lại dữ liệu khi `id` thay đổi
  }, [id]);

  // Fetch additional user data (favorite movies, ratings) after login check
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");

      if (token && userId) {
        try {
          const userResponse = await instance.get(`/user/${userId}`);
          const { favorite_movies = [], ratings = [] } = userResponse.data.data;

          const isMovieFavorite = favorite_movies.some(
            (favMovie: any) => favMovie.id === parseInt(id as string, 10)
          );
          const hasRated = ratings.some(
            (rating: any) => rating.movie_id === parseInt(id as string, 10)
          );

          setUserStatus({
            isLoggedIn: true,
            isFavorite: isMovieFavorite,
            isRated: hasRated,
            favoriteMovies: favorite_movies,
          });
        } catch (error) {
          // console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!userStatus.isLoggedIn) {
      notification.warning({
        message: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thêm phim vào danh sách yêu thích!",
      });
      return;
    }

    try {
      if (userStatus.isFavorite) {
        await instance.delete(`/favorites/${id}`);
        notification.success({
          message: "Thành công",
          description: "Phim đã được xóa khỏi danh sách yêu thích!",
        });
      } else {
        await instance.post(`/favorites/${id}`);
        notification.success({
          message: "Thành công",
          description: "Phim đã được thêm vào danh sách yêu thích!",
        });
      }
      setUserStatus((prev) => ({
        ...prev,
        isFavorite: !prev.isFavorite,
      }));
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý yêu thích phim.",
      });
    }
  };

  const handleRatingSubmit = async () => {
    if (!userStatus.isLoggedIn) {
      notification.warning({
        message: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để đánh giá phim!",
      });
      return;
    }

    try {
      await instance.post("/ratings", {
        movie_id: id,
        rating: ratingData.rating,
        review: ratingData.review,
      });
      notification.success({
        message: "Thành công",
        description: "Cảm ơn bạn đã để lại đánh giá!",
      });
      setRatingData({ rating: 0, review: "", isModalVisible: false });
      setUserStatus((prev) => ({ ...prev, isRated: true }));
    } catch {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi gửi đánh giá.",
      });
    }
  };


  return (
    <>
      <Header />
      <div className="movie-detail-container">
        <div
          className="boxbig"
          style={{
            backgroundImage: `url(${movie?.poster || "https://example.com/default-image.jpg"})`,
          }}
        >
          <div className="info-section">
            <img src={movie?.poster || "placeholder.jpg"} alt={movie?.movie_name} className="poster" />
            <div className="movie-details-wrapper">
              <div className="movie-info">
                <h2 className="title">{movie?.movie_name}</h2>
                <p className="genre">
                  Thể loại: {movie?.movie_category?.map((cat: any) => cat.category_name).join(", ") || "Không có thể loại"}
                </p>

                <div className="actions">
                  <div className="button like" onClick={handleFavoriteToggle}>
                    {userStatus.isFavorite ? "❤️" : "🤍"} <span>Thích</span>
                  </div>
                  <div className="button rate" onClick={() => setRatingData((prev) => ({ ...prev, isModalVisible: true }))}>
                    <FontAwesomeIcon icon={faStar} color={userStatus.isRated ? "#FFD700" : "#ccc"} />
                    <span>Đánh giá</span>
                  </div>
                  <div className="button trailer" onClick={() => setIsTrailerVisible(true)}>Trailer</div>
                  <div className="button buy">
                    <Link to={`/buy-now/${id}`}>Mua vé</Link>
                  </div>
                </div>

                <p className="description">{stripHtml(movie?.description || "Không có mô tả")}</p>

                <div className="movie-details">
                  <div>📅 Khởi chiếu: {movie?.release_date || "Chưa có ngày phát hành"}</div>
                  <div>⏰ Thời lượng: {movie?.duration || "Chưa có thời lượng"}</div>
                  <div>🔞 Giới hạn tuổi: {movie?.age_limit ? `T${movie.age_limit}` : "Không có giới hạn tuổi"}</div>
                </div>
              </div>

              <div className="additional-info">
                <strong>Diễn viên:</strong>
                <p>{movie?.actor?.map((actor: any) => actor.actor_name).join(", ") || "Không có diễn viên"}</p>

                <strong>Đạo diễn:</strong>
                <p>{movie?.director?.map((director: any) => director.director_name).join(", ") || "Không có đạo diễn"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tabs">
            <Link to={`/movie-detail/${id}`} className={`tab ${location.pathname === `/movie-detail/${id}` ? "active" : ""}`}>
              Thông tin phim
            </Link>
            <Link to={`/schedule/${id}`} className={`tab ${location.pathname === `/schedule/${id}` ? "active" : ""}`}>
              Lịch chiếu
            </Link>
            <Link to={`/reviews/${id}`} className={`tab ${location.pathname === `/reviews/${id}` ? "active" : ""}`}>
              Đánh giá
            </Link>
            <Link to={`/news/${id}`} className={`tab ${location.pathname === `/news/${id}` ? "active" : ""}`}>
              Tin tức
            </Link>
            <Link to={`/buy-now/${id}`} className={`tab ${location.pathname === `/buy-now/${id}` ? "active" : ""}`}>
              Mua vé
            </Link>
          </div>
      </div>

      {/* Modal Đánh Giá */}
      <div className="dgp">
      <Modal title="Đánh giá phim" visible={ratingData.isModalVisible} onOk={handleRatingSubmit} onCancel={() => setRatingData({ ...ratingData, isModalVisible: false })}>
        <div className="danhgiaphim">
          <div className="imgphim">
            <img src={movie?.poster || "placeholder.jpg"} alt={movie?.movie_name} />
          </div>
          <div className="noidungdanhgia">
            <p>Hãy để lại đánh giá của bạn cho phim {movie?.movie_name}!</p>
            <div className="rating">
              {[...Array(10).keys()].map((i) => (
                <FontAwesomeIcon key={i} icon={faStar} color={i < ratingData.rating ? "#FFD700" : "#ccc"} onClick={() => setRatingData((prev) => ({ ...prev, rating: i + 1 }))} style={{ cursor: "pointer" }} />
              ))}
            </div>
            <textarea value={ratingData.review} onChange={(e) => setRatingData((prev) => ({ ...prev, review: e.target.value }))} />
          </div>
        </div>
      </Modal>
      </div>


    
      <Modal
  title={movie?.movie_name}  // Ẩn tiêu đề nếu không cần
  visible={isTrailerVisible}
  onCancel={() => setIsTrailerVisible(false)}
  footer={null}
  centered // Modal xuất hiện giữa màn hình
  className="custom-modal"
>
  {movie?.trailer ? (
    <iframe
      width="100%"
      height="100%"
      src={movie.trailer}
      title="Trailer"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ borderRadius: "10px", border: "none" }} // Tùy chỉnh giao diện iframe
    ></iframe>
  ) : (
    <div className="no-trailer">
      <p>Trailer không khả dụng</p>
    </div>
  )}
</Modal>


    </>
  );
};

export default MovieDetail;
