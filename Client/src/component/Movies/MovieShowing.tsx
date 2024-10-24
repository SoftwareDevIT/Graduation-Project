import React, { useState, useEffect } from 'react';
import "./MovieShowing.css"
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import instance from "../../server";
import { Movie } from "../../interface/Movie";

const MovieShowing: React.FC = () => {
  const [selectedPopular, setSelectedPopular] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]); // Danh sách phim

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await instance.get("/movies");
        setMovies(response.data.data.original);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handlePopularChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPopular(event.target.value);
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(event.target.value);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <>
      <Header />
      <div className="movie-showing">
        {/* Phần Banner */}
        <div className="banner">
          <h2>Phim đang chiếu</h2>
          <p>
            Danh sách các phim hiện đang chiếu rạp trên toàn quốc 24/10/2024. Xem lịch chiếu phim, giá vé tiện lợi, đặt vé nhanh chỉ với 1 bước!
          </p>
        </div>
        <div className="titleg">
          <div className="filters">
            <select value={selectedPopular} onChange={handlePopularChange} className="filter-select">
              <option value="">Phổ biến</option>
              <option value="most-popular">Phổ biến nhất</option>
              <option value="newest">Mới nhất</option>
              <option value="top-rated">Xếp hạng cao</option>
            </select>

            <select value={selectedGenre} onChange={handleGenreChange} className="filter-select">
              <option value="">Thể loại</option>
              <option value="action">Hành động</option>
              <option value="drama">Chính kịch</option>
              <option value="comedy">Hài kịch</option>
            </select>

            <select value={selectedLanguage} onChange={handleLanguageChange} className="filter-select">
              <option value="">Ngôn ngữ</option>
              <option value="vietnamese">Tiếng Việt</option>
              <option value="english">Tiếng Anh</option>
              <option value="japanese">Tiếng Nhật</option>
            </select>
          </div>

          <div className="movie-list">
            {/* Hiển thị danh sách phim từ API */}
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img src={movie.poster || "placeholder.jpg"} alt={movie.movie_name} className="movie-image" />
                <div className="movie-info">
                  <h3>{movie.movie_name}</h3>
                  <p>Khởi chiếu: {movie.release_date ? new Date(movie.release_date).toLocaleDateString("vi-VN") : "N/A"}</p>
                  {/* Nếu cần, có thể thêm thông tin thể loại, ngôn ngữ, đánh giá ở đây */}
                </div>
                {movie.release_date === '2024-10-25' && ( // Thay đổi điều kiện phù hợp
                  <div className="early-access-tag">Chiếu sớm</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MovieShowing;
