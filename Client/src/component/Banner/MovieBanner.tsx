import React from "react";
import "./MovieBanner.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { Movie } from "../../interface/Movie";
import { useMovieContext } from "../../Context/MoviesContext";

const MovieBanner = () => {
  // Lấy dữ liệu từ context
  const { state: { movies } } = useMovieContext();

  // Cấu hình cho slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 4,
    slidesToShow: 8,
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  // Nếu không có dữ liệu phim hoặc mảng rỗng
  if (!Array.isArray(movies) || movies.length === 0) {
    return <div className="loading-message">No movies available</div>;
  }

  return (
    <div className="movie-banner">
      <div className="banner-header">
        <h2>Đang chiếu</h2>|<h2 style={{ color: "#95aac9" }}>Sắp chiếu</h2>
      </div>
      <div className="movie-slider">
        <div className="slider-container">
          <Slider {...settings}>
            {movies.map((movie) => (
              <div key={movie.id}>
                <div className="movie-item">
                  <Link state={{ movieId: movie.id }} to={`/movie-detail/${movie.id}`}>
                    <img
                      src={movie.poster || "placeholder.jpg"}
                      alt={movie.movie_name}
                    />
                  </Link>
                  <div className="movie-info">
                    <button className="buy-ticket">
                      <Link to={`/buy-now/${movie.id}`}>Mua vé</Link>
                    </button>
                    <p className="name_movie">{movie.movie_name}</p>
                    <span>
                      {movie.release_date
                        ? new Date(movie.release_date).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default MovieBanner;
