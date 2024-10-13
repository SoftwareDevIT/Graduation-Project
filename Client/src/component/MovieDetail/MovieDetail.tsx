import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import instance from "../../server";
import "./MovieDetail.css";

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [actor, setActor] = useState<string | null>(null);
  const [director, setDirector] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieResponse = await instance.get(`/movies/${id}`);
        setMovie(movieResponse.data.data);

        // Fetch actor name
        if (movieResponse.data.data.actor_id) {
          const actorResponse = await instance.get(`/actor/${movieResponse.data.data.actor_id}`);
          setActor(actorResponse.data.data.actor_name);
        }

        // Fetch director name
        if (movieResponse.data.data.director_id) {
          const directorResponse = await instance.get(`/director/${movieResponse.data.data.director_id}`);
          setDirector(directorResponse.data.data.director_name);
        }

        // Fetch movie category name
        if (movieResponse.data.data.movie_category_id) {
          const categoryResponse = await instance.get(`/movie-category/${movieResponse.data.data.movie_category_id}`);
          setCategory(categoryResponse.data.data.category_name);
        }
      } catch (error) {
        console.error(error);
    
      }
    };
    fetchMovie();
  }, [id]);

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
                <p className="genre">Thể loại: {category || "Không có thể loại"}</p>

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
                <strong>Diễn viên:</strong> <p>{actor || "Không có diễn viên"}</p>
                <strong>Đạo diễn:</strong><p>{director || "Không có đạo diễn"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="tabs">
          <Link to={`/moviedetail/${id}`} className="tab active">Thông tin phim</Link>
          <Link to={`/schedule/${id}`} className="tab">Lịch chiếu</Link>
          <Link to={`/reviews/${id}`} className="tab">Đánh giá</Link>
          <Link to={`/news/${id}`} className="tab">Tin tức</Link>
          <Link to={`/buy-now/${id}`} className="tab">Mua vé</Link>
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
