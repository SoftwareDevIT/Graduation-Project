import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import instance from "../../server";
import "./MovieDetail.css";

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieResponse = await instance.get(`/movies/${id}`);
        // Cập nhật lại theo dữ liệu trả về
        setMovie(movieResponse.data.data.original);
      } catch (error) {
        console.error(error);
   
      }
    };
    fetchMovie();
  }, [id]);

  const location = useLocation();
  if (error) return <div>Error loading movie details</div>;

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
                <h1 className="title">{movie?.movie_name}</h1>
                
                {/* Hiển thị thể loại phim */}
                <p className="genre">Thể loại: {movie?.category?.map((cat: any) => cat.director_name).join(', ') || "Không có thể loại"}</p>

                <div className="actions">
                  <div className="button like">
                    <span role="img" aria-label="like">❤️</span>{" "}
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
                {/* Hiển thị diễn viên */}
                <strong>Diễn viên:</strong>
                <p>{movie?.actor?.map((act: any) => act.actor_name).join(', ') || "Không có diễn viên"}</p>
                
                {/* Hiển thị đạo diễn */}
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
    </>
  );
};

export default MovieDetail;
