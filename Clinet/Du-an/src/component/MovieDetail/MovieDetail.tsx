import React from "react";
import "./MovieDetail.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import { ContentMovie } from "./ContentMovie";
import { Link } from "react-router-dom";

const MovieDetail: React.FC = () => {
    return (
        <>
            <Header />
            <div className="movie-detail-container">
                <div className="boxbig">
                    <div className="info-section">
                        {/* Poster của phim */}
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/6/66/Transformers07.jpg"
                            alt="Transformers"
                            className="poster"
                        />

                        {/* Thông tin chi tiết phim */}
                        <div className="movie-details-wrapper">
                            <div className="movie-info">
                                <h1 className="title">Transformers Một</h1>
                                <p className="genre">Action, Adventure, Animation, Family, Science Fiction</p>

                                <div className="actions">
                                    <button className="button like">Thích</button>
                                    <button className="button rate">Đánh giá</button>
                                    <button className="button trailer">Trailer</button>
                                    <button className="button buy-ticket-button">Mua vé</button>
                                </div>

                                <p className="description">
                                    Câu chuyện về nguồn gốc chưa từng được hé lộ của Optimus Prime và Megatron. Hai nhân vật được biết đến như
                                    những kẻ thù truyền kiếp, nhưng cũng từng là những người anh em gắn bó, đã thay đổi vận mệnh của Cybertron mãi
                                    mãi.
                                </p>

                                <div className="movie-details">
                                    <div>
                                        <span>📅 Khởi chiếu: </span>27/09/2024
                                    </div>
                                    <div>
                                        <span>⏰ Thời lượng: </span>120 phút
                                    </div>
                                    <div>
                                        <span>🔞 Giới hạn tuổi: </span>T13
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin diễn viên, đạo diễn, nhà sản xuất */}
                            <div className="additional-info">
                                <strong>Diễn viên:</strong> <p> Laurence Fishburne, Jon Hamm, Keegan-Michael Key, Scarlett Johansson, Brian Tyree Henry</p>
                                <strong>Đạo diễn:</strong><p>Josh Cooley</p>
                                <strong>Nhà sản xuất:</strong><p> Aaron Dem, Mark Vahradian, Tom DeSanto</p>
                            </div>
                        </div>
                    </div>

                </div>
                {/* Tabs */}
                <div className="tabs">
                    <Link  to={"/thong-tin-phim"} className="tab active">Thông tin phim</Link>
                    <Link  to={"/lich-chieu"} className="tab ">Lịch chiếu</Link>
                    <Link  to={"/danh-gia"} className="tab ">Đánh giá</Link>
                    <Link  to={"/tin-tuc"} className="tab ">Tin tức</Link>
                    <Link  to={"/mua-ve"} className="tab ">Mua vé</Link>
                    
                </div>

                {/* Phần chọn lịch chiếu */}
           
            </div>
          
        </>
    );
};

export default MovieDetail;
