import React from "react";
import "./MovieDetail.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import MovieDetail from "./MovieDetail";

const DanhGia: React.FC = () => {
    return (
        <>
            
           <MovieDetail/>
                {/* Phần chọn lịch chiếu */}
                <div className="content">
                    <div className="container">
                        <div className="community-section">
                            <h3>Cộng đồng</h3>
                            <div className="comment">
                                <p className="comment-user"><strong>VoDucTri744</strong> <span className="comment-rating">⭐ 8</span> • 4 ngày trước</p>
                                <p className="comment-text">
                                    Lồng tiếng ok, hài hước còn lại nội dung nhưng do t chưa hiểu câu chuyện về TPM lắm nên chủ yếu lồng tiếng có ảnh KMT, QNT vs đặc biệt là CP nên sr sr.
                                </p>
                                <div className="comment-actions">
                                    <button className="like-btn">👍</button>
                                    <button className="dislike-btn">👎</button>
                                </div>
                            </div>
                            <div className="comment">
                                <p className="comment-user"><strong>VoDucTri744</strong> <span className="comment-rating">⭐ 8</span> • 4 ngày trước</p>
                                <p className="comment-text">
                                    Lồng tiếng ok, hài hước còn lại nội dung nhưng do t chưa hiểu câu chuyện về TPM lắm nên chủ yếu lồng tiếng có ảnh KMT, QNT vs đặc biệt là CP nên sr sr.
                                </p>
                                <div className="comment-actions">
                                    <button className="like-btn">👍</button>
                                    <button className="dislike-btn">👎</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
        
            <Footer />
        </>
    );
};

export default DanhGia;
