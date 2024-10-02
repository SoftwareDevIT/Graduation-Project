
import React, {  useState, useEffect} from 'react';
import './MovieBanner.css';
import Slider from 'react-slick';

 import instance from '../../server';
 import 'slick-carousel/slick/slick.css'; 
 import 'slick-carousel/slick/slick-theme.css';
import { Movie } from '../../interface/Movie';
 

const MovieBanner = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await instance.get('/movies');  
            setMovies(response.data.data);
        } catch (error) {
          console.error('Failed to fetch movies:', error);
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
              }
          },
          {
              breakpoint: 768,
              settings: {
                  slidesToShow: 3,
              }
          },
          {
              breakpoint: 480, 
              settings: {
                  slidesToShow: 3,
                  
              }
          }
      ]
      };
  return (
    <div className="movie-banner">
      <div className="banner-header">
        <h2>Đang chiếu</h2>|<h2 style={{color: "#95aac9"}}>Sắp chiếu</h2>
      </div>
      <div className="movie-slider">
      <div className="slider-container">
      <Slider {...settings}>
        {movies.map((movie) => (
              <div key={movie.id}>
                <div className="movie-item">
                  <img src={movie.poster || 'placeholder.jpg'} alt={movie.movie_name} />
                  <div className="movie-info">
                    <button className="buy-ticket">Mua vé</button>
                    <p className='name_movie'>{movie.movie_name}</p>
                    <span>{movie.release_date ? new Date(movie.release_date).toLocaleDateString('vi-VN') : 'N/A'}</span>
                    <span className="rating">{movie.age_limit ? `${movie.age_limit}` : 'N/A'}</span>
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

export default MovieBanner
