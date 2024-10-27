import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners"; // Import thư viện loading
import axios from 'axios';
import Footer from "../Footer/Footer";
import './FilmNews.css';
import Header from "../Header/Hearder";
import { NewsItem } from "../../interface/NewsItem";
import instance from "../../server";
import { Link } from "react-router-dom";

function FilmNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true); // State quản lý loading cho cả trang

  // Gọi API lấy dữ liệu tin tức
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await instance.get('/news'); // Gọi API
        setNews(response.data.data); // Lưu dữ liệu vào state
        setLoading(false); // Dừng loading sau khi tải xong
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false); // Dừng loading nếu có lỗi
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      {/* Hiển thị loading overlay cho cả trang */}
      {loading && (
        <div className="overlay-loading">
          <ClipLoader color={"#333"} loading={loading} size={150} />
        </div>
      )}

      {/* Nội dung trang chỉ hiển thị khi loading = false */}
      {!loading && (
        <>
          <Header />
          <div className="Contentseach">
            <div className="banner-movies">
              <h2>Tin Điện Ảnh</h2>
              <div className="text-white mt-0 description">
                Tin tức điện ảnh Việt Nam & thế giới
              </div>
            </div>
            <div className="container box-cha2">
              <div className="row boxcha-4">
                <div className="tintucmoi col-lg-8">
                  <h2>Mới Nhất</h2>

                  {news.map((item) => (
                    <div key={item.id} className="div-item">
                      <div className="img">
                        <img src={item.thumnail} alt={item.title} />
                      </div>
                      <div className="content-new">
                      <Link to={`/postdetail/${item.id}`}><h3>{item.title}</h3></Link>
                        <p>{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="chuyenmuc col-lg-4">
                  <h3>Chuyên mục</h3>
                  <div className="noidung">
                    <h4>Đánh giá phim</h4>
                    <p>Góc nhìn chân thực, khách quan nhất về các bộ phim</p>
                  </div>
                  <div className="noidung">
                    <h4>Tin điện ảnh</h4>
                    <p>Tin tức điện ảnh Việt Nam & thế giới</p>
                  </div>
                  <div className="noidung">
                    <h4>Video - Trailer</h4>
                    <p>Trailer, video những phim chiếu rạp và truyền hình hot nhất</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default FilmNews;
