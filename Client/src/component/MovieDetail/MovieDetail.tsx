import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import instance from "../../server";
import { notification, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./MovieDetail.css";
import Header from "../Header/Hearder";

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isRated, setIsRated] = useState(false); // Thêm state kiểm tra đánh giá
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieResponse = await instance.get(`/movies/${id}`);
        setMovie(movieResponse.data.data.original);

        const token = localStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
          const userId = localStorage.getItem("user_id");

          if (userId) {
            const userResponse = await instance.get(`/user/${userId}`);
            const favoriteMoviesData =
              userResponse.data.data.favorite_movies || [];
            setFavoriteMovies(favoriteMoviesData);

            const isMovieFavorite = favoriteMoviesData.some(
              (favMovie: any) => favMovie.id === parseInt(id as string, 10)
            );
            setIsFavorite(isMovieFavorite);

            // Kiểm tra nếu đã đánh giá
            const hasRated = userResponse.data.data.ratings.some(
              (rating: any) => rating.movie_id === parseInt(id as string, 10)
            );
            setIsRated(hasRated);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchMovie();
  }, [id]);

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      notification.warning({
        message: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để thêm phim vào danh sách yêu thích!",
      });
      return;
    }

    try {
      if (isFavorite) {
        await instance.delete(`/favorites/${id}`);
        notification.success({
          message: "Thành công",
          description: "Phim đã được xóa khỏi danh sách yêu thích!",
        });
        setIsFavorite(false);
      } else {
        await instance.post(`/favorites/${id}`);
        notification.success({
          message: "Thành công",
          description: "Phim đã được thêm vào danh sách yêu thích!",
        });
        setIsFavorite(true);
      }
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý yêu thích phim.",
      });
    }
  };

  const handleRate = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      await instance.post("/ratings", {
        movie_id: id,
        rating: rating,
        review: review,
      });
      notification.success({
        message: "Thành công",
        description: "Cảm ơn bạn đã để lại đánh giá!",
      });
      setReview("");
      setRating(0);
      setIsModalVisible(false);
      setIsRated(true); // Cập nhật trạng thái đã đánh giá
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi gửi đánh giá.",
      });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setReview("");
    setRating(0);
  };

  if (!movie) return <div>Đang tải...</div>;

  return (
    <>
      <Header />
      <div className="movie-detail-container">
        <div
          className="boxbig"
          style={{
            backgroundImage: `url(${
              movie?.poster || "https://example.com/default-image.jpg"
            })`,
          }}
        >
          <div className="info-section">
            <img
              src={movie?.poster || "placeholder.jpg"}
              alt={movie?.movie_name}
              className="poster"
            />
            <div className="movie-details-wrapper">
              <div className="movie-info">
                <h2 className="title">{movie?.movie_name}</h2>
                <p className="genre">
                  Thể loại:{" "}
                  {movie?.category
                    ?.map((cat: any) => cat.category_name)
                    .join(", ") || "Không có thể loại"}
                </p>

                <div className="actions">
                  <div className="button like" onClick={handleFavorite}>
                    {isFavorite ? (
                      <span role="img" aria-label="liked">
                        ❤️
                      </span>
                    ) : (
                      <span role="img" aria-label="unliked">
                        🤍
                      </span>
                    )}
                    <span className="like-1">Thích</span>
                  </div>

                  <div className="button rate like" onClick={handleRate}>
                    <FontAwesomeIcon
                      icon={faStar}
                      color={isRated ? "#FFD700" : "#ccc"} // Đổi màu dựa trên trạng thái đánh giá
                      className="ngoisao"
                    />
                    <span className="like-1 like2">Đánh giá</span>
                  </div>
                  <div className="button trailer">Trailer</div>
                  <div className="button buy">Mua vé</div>
                </div>

                <p className="description">
                  {movie?.description || "Không có mô tả"}
                </p>

                <div className="movie-details">
                  <div>
                    <span>📅 Khởi chiếu: </span>
                    {movie?.release_date || "Chưa có ngày phát hành"}
                  </div>
                  <div>
                    <span>⏰ Thời lượng: </span>
                    {movie?.duration || "Chưa có thời lượng"}
                  </div>
                  <div>
                    <span>🔞 Giới hạn tuổi: </span>
                    {movie?.age_limit
                      ? `T${movie?.age_limit}`
                      : "Không có giới hạn tuổi"}
                  </div>
                </div>
              </div>

              <div className="additional-info">
                <strong>Diễn viên:</strong>
                <p>
                  {movie?.actor?.map((act: any) => act.actor_name).join(", ") ||
                    "Không có diễn viên"}
                </p>

                <strong>Đạo diễn:</strong>
                <p>
                  {movie?.director
                    ?.map((dir: any) => dir.director_name)
                    .join(", ") || "Không có đạo diễn"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Các phần khác không thay đổi */}
      </div>
      {/* Modal đánh giá */}
      <Modal
        title="Đánh giá phim"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <div className="danhgiaphim">
          <div className="imgphim">
            <img
              src={movie?.poster || "placeholder.jpg"}
              alt={movie?.movie_name}
            />
          </div>
          <div className="noidungdanhgia">
            <p>Hãy để lại đánh giá của bạn cho phim {movie?.movie_name}!</p>
            <div className="rating">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <FontAwesomeIcon
                  key={value}
                  icon={faStar}
                  color={value <= rating ? "#FFD700" : "#ccc"}
                  onClick={() => setRating(value)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Nhập đánh giá của bạn"
              rows={5}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MovieDetail;
