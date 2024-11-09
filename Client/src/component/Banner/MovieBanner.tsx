import React, { useState, useEffect } from "react";
import "./MovieBanner.css";
import Slider from "react-slick";

import instance from "../../server";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Movie } from "../../interface/Movie";
import { Link } from "react-router-dom";

const MovieBanner = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieDetails, setMovieDetails] = useState<Record<number, Movie>>({});

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await instance.get("/movies");

        const limitedMovies = response.data.data.original.slice(0, 15); // Get only the first 20 movies

        const limitedMovies = response.data.data.original.slice(0, 20); // Get only the first 20 movies

        setMovies(limitedMovies);

        // Fetch movie details for each movie
        const movieDetailsPromises = limitedMovies.map((movie: Movie) =>
          instance.get(`/movies/${movie.id}`)
        );

        const movieDetailsResponses = await Promise.all(movieDetailsPromises);
        const detailsMap = movieDetailsResponses.reduce((acc: Record<number, Movie>, cur, index) => {
          acc[limitedMovies[index].id] = cur.data;
          return acc;
        }, {});

        setMovieDetails(detailsMap);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, []);

  var settings = {
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
                    <button className="buy-ticket"><Link to={`/buy-now/${movie.id}`} >Mua vé</Link></button>
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
