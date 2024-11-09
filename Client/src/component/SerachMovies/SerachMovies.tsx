import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Lấy movie_name từ URL
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import "./SerachMovies.css";

import instance from "../../server"; // Sử dụng instance từ server
import { Movie } from "../../interface/Movie";


const SearchMovies = () => {
  const { movie_name } = useParams(); // Lấy tên phim từ URL
  const [movies, setMovies] = useState<Movie[]>([]); // State lưu danh sách phim
  const [loading, setLoading] = useState<boolean>(true); // State lưu trạng thái loading
  const [error, setError] = useState<string | null>(null); // State lưu lỗi

  useEffect(() => {
    // Gọi API tìm kiếm phim
    setLoading(true); // Bắt đầu tải
    instance
      .get(`/movie/search/${movie_name}`)
      .then((response) => {
        setMovies(response.data.data);
        setLoading(false); // Tải xong
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi tìm kiếm phim:", error);
        setError("Không thể tìm kiếm phim. Vui lòng thử lại sau."); // Lưu lỗi
        setLoading(false); // Tắt loading
      });
  }, [movie_name]); // Chạy lại khi movie_name thay đổi

  return (
    <>
      <Header />
      <div className="Contentseach">
     
          <div className="banner-movies">
            <h2>Tìm Kiếm</h2>
            <div className="text-white mt-0 description">
              Theo từ khóa '{movie_name}'
            </div>
          </div>
          <div className="container">
          {/* Hiển thị khi đang tải */}
          {loading && <div className="loader">Đang tìm kiếm...</div>}

          {/* Hiển thị lỗi nếu có */}
          {error && <div className="error-message">{error}</div>}

          {/* Hiển thị kết quả tìm kiếm */}
          {!loading && !error && (
            <div className="movelikeone">
              <h3 className="phimtile">Phim</h3>
              <div className={`row move-itemone ${movies.length > 1 ? "more-than-one" : ""}`}>
  {movies.length > 0 ? (
    movies.map((movie) => (
      <div key={movie.id} className="col-lg-2 move-itemone-1">
         <Link state={{ movieId: movie.id }} to={`/movie-detail/${movie.id}`}> <img src={movie.poster || undefined} alt={movie.name} /></Link>
       
        <h4>{movie.movie_name}</h4>
        <p>{movie.release_date}</p>
      </div>
    ))
  ) : (
    <p>Không có phim nào phù hợp.</p>
  )}
</div>

            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchMovies;
