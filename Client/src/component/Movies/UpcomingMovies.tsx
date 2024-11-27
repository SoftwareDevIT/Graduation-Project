import React, { useState, useEffect } from 'react';
import "./MovieShowing.css"; // Tận dụng lại CSS của MovieShowing
import Footer from '../Footer/Footer';
import instance from "../../server";
import { Movie } from "../../interface/Movie";
import Header from '../Header/Hearder';
import { Link } from 'react-router-dom';

const UpcomingMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]); // Khởi tạo mặc định là mảng rỗng
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái tải phim
  const [error, setError] = useState<string | null>(null); // Lỗi nếu có

  useEffect(() => {
    fetchUpcomingMovies();
  }, []);

  const fetchUpcomingMovies = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/fillMovies/upcoming");
      const moviesData = response.data?.data?.[0]?.movies?.data || [];
   
        setMovies(moviesData);
      
    } catch (error) {
      console.error("Không thể tải phim sắp chiếu:", error);
      setError("Không thể tải dữ liệu phim sắp chiếu. Vui lòng thử lại sau.");
      setMovies([]);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <Header />
      <div className="banner">
        <h2>Phim sắp chiếu</h2>
        <p>
          Danh sách các phim sắp chiếu rạp trên toàn quốc. Xem thông tin phim, ngày ra mắt và các tin tức liên quan!
        </p>
      </div>
      <div className="movie-showing">
        <div className="container">
          <div className="titleg">
            <div className="danh-sach-phim">
              {Array.isArray(movies) && movies.length > 0 ? (
                movies.map((movie) => (
                  <div key={movie.id || movie.slug} className="phim-card">
                    <Link to={`/movie-detail/${movie.slug}`}>
                      <img
                        src={movie.poster || "placeholder.jpg"}
                        alt={movie.movie_name}
                        className="phim-hinh"
                      />
                    </Link>
                    <div className="phim-thong-tin">
                      <h3>{movie.movie_name}</h3>
                      <p>
                        Khởi chiếu:{" "}
                        {movie.release_date
                          ? new Date(movie.release_date).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : loading ? (
                <p>Đang tải phim...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <p>Không có phim sắp chiếu.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpcomingMovies;
