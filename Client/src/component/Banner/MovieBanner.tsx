import React from "react";
import { useQuery } from "@tanstack/react-query";
import "./MovieBanner.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { Movie } from "../../interface/Movie";
import instance from "../../server";

// Hàm lấy dữ liệu phim từ API
const fetchMovies = async (): Promise<Movie[]> => {
  const response = await instance.get("/movies");
  return response.data.data.original.slice(0, 15); // Giới hạn 15 bộ phim đầu tiên
};

const MovieBanner = () => {
  // Dùng React Query để fetch danh sách phim
  const { data: movies, isLoading, isError } = useQuery<Movie[], Error>({
    queryKey: ["movies"], // Đây là queryKey cần thiết
    queryFn: fetchMovies, // Hàm fetch dữ liệu
  });

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

  // Nếu đang loading hoặc có lỗi
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading movies</div>;

  return (
    <div className="movie-banner">
      <div className="banner-header">
        <h2>Đang chiếu</h2>|<h2 style={{ color: "#95aac9" }}>Sắp chiếu</h2>
      </div>
      <div className="movie-slider">
        <div className="slider-container">
          <Slider {...settings}>
            {movies?.map((movie) => (
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
