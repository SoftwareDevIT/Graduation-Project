import React, { useEffect, useState } from "react";

import "./MovieDetail.css";

import Footer from "../Footer/Footer";
import MovieDetail from "./MovieDetail";
import instance from "../../server";
import { useMovieContext } from "../../Context/MoviesContext";
import { useParams } from "react-router-dom";

const DanhGia: React.FC = () => {
    const { slug } = useParams(); // Sử dụng slug
  const { state } = useMovieContext(); // Lấy dữ liệu từ MovieContext
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


 

  const movie = state.movies.find((movie) => movie.slug === slug);
  // Gọi API lấy danh sách đánh giá
  useEffect(() => {
    if (movie?.id) {
      setLoading(true);
      instance
        .get(`/ratings/${movie?.id}`)
        .then((response) => {
          if (response.data.status) {
            setRatings(response.data.data);
          } else {
            setError("Không có đánh giá cho phim này.");
          }
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError("ID phim không tồn tại.");
      setLoading(false);
    }
  }, [movie?.id]);

  return (
    <>
      <MovieDetail />
      <div className="community-section">
        <h3>Cộng đồng</h3>
       {ratings.length > 0 ? (
          ratings.map((rating) => (
            <div className="comment" key={rating.id}>
              <p className="comment-user">
                <i className="fas fa-user-circle avatar-icon"></i>
                <strong>{rating.user_name}</strong>
                <span className="comment-rating">
                  ⭐ {rating.rating}
                </span>{" "}
                • {new Date(rating.created_at).toLocaleDateString()}
              </p>
              <p className="comment-text">
                {rating.review || "Không có nội dung đánh giá."}
              </p>
              <div className="comment-actions">
                <button className="like-btn">👍</button>
                <button className="dislike-btn">👎</button>
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào cho phim này.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DanhGia;
