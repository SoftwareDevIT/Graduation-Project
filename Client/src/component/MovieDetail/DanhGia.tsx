import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MovieDetail.css";

import Footer from "../Footer/Footer";
import MovieDetail from "./MovieDetail";
import instance from "../../server";


const DanhGia: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Lấy id từ URL
    const [ratings, setRatings] = useState<any[]>([]);  // State để lưu danh sách đánh giá
    const [loading, setLoading] = useState<boolean>(true);  // Trạng thái tải
    const [error, setError] = useState<string | null>(null);  // Trạng thái lỗi

    // Gọi API lấy danh sách đánh giá
    useEffect(() => {
        if (id) {
            setLoading(true);
            instance
                .get(`/ratings/${id}`)  // Thay đổi từ fetch thành instance.get
                .then((response) => {
                    if (response.data.status) {
                        setRatings(response.data.data);  // Lưu đánh giá vào state
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
    }, [id]);

    

    return (
        <>
           
       
                        <MovieDetail />
                        <div className="community-section">
                            <h3>Cộng đồng</h3>

                            {/* Lặp qua danh sách đánh giá và hiển thị */}
                            {ratings.length > 0 ? (
                                ratings.map((rating) => (
                                    <div className="comment" key={rating.id}>
                                        <p className="comment-user">
                                            <i className="fas fa-user-circle avatar-icon"></i>
                                            <strong>{rating.user_name}</strong>
                                            <span className="comment-rating">⭐ {rating.rating}</span> • {new Date(rating.created_at).toLocaleDateString()}
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
