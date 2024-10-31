import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import instance from "../../server";
import "./MovieDetail.css";
import { notification } from "antd"; 
import Header from "../Header/Hearder";

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Kiểm tra đăng nhập
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]); // Khai báo state cho danh sách phim yêu thích
  const navigate = useNavigate(); // Thêm useNavigate
  
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieResponse = await instance.get(`/movies/${id}`);
        setMovie(movieResponse.data.data.original);
  
        const token = localStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
          const userId = localStorage.getItem('user_id');
  
          if (userId) {
            const userResponse = await instance.get(`/user/${userId}`);

            const favoriteMoviesData = userResponse.data.data.favorite_movies || [];
            setFavoriteMovies(favoriteMoviesData); // Cập nhật danh sách phim yêu thích
  
            console.log("Danh sách phim yêu thích:", favoriteMoviesData); // Debug danh sách yêu thích
            
            // Kiểm tra if id of movie is in favoriteMovies
            const isMovieFavorite = favoriteMoviesData.some((favMovie: any) => favMovie.id === parseInt(id as string, 10));
            console.log(`Phim ${id} có trong danh sách yêu thích: ${isMovieFavorite}`); // Debug trạng thái yêu thích
            setIsFavorite(isMovieFavorite);
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
      // Nếu chưa đăng nhập, hiển thị thông báo yêu cầu đăng nhập
      notification.warning({
        message: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để thêm phim vào danh sách yêu thích!',
      });
      return;
    }
  
    try {
      if (isFavorite) {
        // Xóa phim khỏi danh sách yêu thích
        await instance.delete(`/favorites/${id}`);
        notification.success({
          message: 'Thành công',
          description: 'Phim đã được xóa khỏi danh sách yêu thích!',
        });
        setIsFavorite(false); // Cập nhật trạng thái
      } else {
        // Thêm phim vào danh sách yêu thích
        await instance.post(`/favorites/${id}`); // Cần kiểm tra API
        notification.success({
          message: 'Thành công',
          description: 'Phim đã được thêm vào danh sách yêu thích!',
        });
        setIsFavorite(true); // Cập nhật trạng thái yêu thích
      }
    } catch (error: any) {
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi xử lý yêu thích phim.',
      });
    }
  };

  const location = useLocation();
  
  if (!movie) return <div>Đang tải...</div>; // Thêm kiểm tra nếu phim chưa được tải

  return (
    <>
      <Header />
      <div className="movie-detail-container">
        <div className="boxbig" style={{ backgroundImage: `url(${movie?.poster || 'https://example.com/default-image.jpg'})` }}>
          <div className="info-section">
            <img
              src={movie?.poster || "placeholder.jpg"}
              alt={movie?.movie_name}
              className="poster"
            />
            <div className="movie-details-wrapper">
              <div className="movie-info">
                <h2 className="title">{movie?.movie_name}</h2>
                <p className="genre">Thể loại: {movie?.category?.map((cat: any) => cat.director_name).join(', ') || "Không có thể loại"}</p>

                <div className="actions">
                  <div className="button like" onClick={handleFavorite}>
                    {isFavorite ? (
                      <span role="img" aria-label="liked">❤️</span> // Hiển thị biểu tượng đã thích
                    ) : (
                      <span role="img" aria-label="unliked">🤍</span> // Hiển thị biểu tượng chưa thích
                    )}
                    <span className="like-1">Thích</span>
                  </div>

                  <div className="button rate like">
                    <span role="img" aria-label="rate">⭐</span>{" "}
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
                    <span>📅 Khởi chiếu: </span>{movie?.release_date || "Chưa có ngày phát hành"}
                  </div>
                  <div>
                    <span>⏰ Thời lượng: </span>{movie?.duration || "Chưa có thời lượng"}
                  </div>
                  <div>
                    <span>🔞 Giới hạn tuổi: </span>{movie?.age_limit ? `T${movie?.age_limit}` : "Không có giới hạn tuổi"}
                  </div>
                </div>
              </div>

              <div className="additional-info">
                <strong>Diễn viên:</strong>
                <p>{movie?.actor?.map((act: any) => act.actor_name).join(', ') || "Không có diễn viên"}</p>

                <strong>Đạo diễn:</strong>
                <p>{movie?.director?.map((dir: any) => dir.director_name).join(', ') || "Không có đạo diễn"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tabs">
          <Link to={`/movie-detail/${id}`} className={`tab ${location.pathname === `/movie-detail/${id}` ? "active" : ""}`}>
            Thông tin phim
          </Link>
          <Link   state={{ movie }}  to={`/schedule/${id}`} className={`tab ${location.pathname === `/schedule/${id}` ? "active" : ""}`}>
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
    </>
  );
};

export default MovieDetail;
