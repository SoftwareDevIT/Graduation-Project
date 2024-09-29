import React from "react";
import "./MovieDetail.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import MovieDetail from "./MovieDetail";

const TinTuc: React.FC = () => {
    return (
        <>
        <div>
          <MovieDetail/>
                <div className="content">
                    <div className="container">
                        <div className="title-2">
                            <h3>Bài viết liên quan</h3>
                        </div>
                        <div className="related-posts">


                            <div className="newcontent">
                                <div className="post">
                                    <img
                                        src="https://cdn-i.vtcnews.vn/resize/th/upload/2021/08/04/hinhanh0-07010768.jpg"
                                        alt="Transformers Review"
                                        className="post-image"
                                    />
                                    <div className="post-info">
                                        <a href="#" className="post-title">Review Transformers Một – Hoành tráng và bùng nổ hơn cả kỳ vọng</a>
                                        <p className="post-meta">Đánh giá phim • miduynph • 6 ngày trước</p>
                                        <p className="post-meta-2">Khác với trailer không mấy hấp dẫn thì bộ phim Transformers Một (Transformers One) lại mang đến điều ngược lại.</p>
                                    </div>
                                </div>
                                <div className="post">
                                    <img
                                        src="https://i.vietgiaitri.com/2019/5/10/vu-tru-dien-anh-marvel-da-ton-tai-mot-sieu-anh-hung-la-gay-nhung-103fd0.jpg"
                                        alt="8 Phim Hoạt Hình Đáng Mong Đợi"
                                        className="post-image"
                                    />
                                    <div className="post-info">
                                        <a href="#" className="post-title">8 Phim hoạt hình đáng mong đợi nhất nửa cuối năm 2024</a>
                                        <p className="post-meta">linhhuynh0257 • 2 tháng trước</p>
                                        <p className="post-meta-2">Hàng loạt những phim hoạt hình đáng chú ý sẽ ra mắt vào thời điểm nửa cuối năm 2024 này. Liệu có bộ phim nào có thể đạt được thành tích mà Inside Out 2 đã làm được hay không?</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                     

                    </div>
                </div>
                <Footer/>
                </div>
        </>
    );
};

export default TinTuc;
