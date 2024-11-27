import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./PostDetail.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Hearder";
import { NewsItem } from "../../interface/NewsItem";
import instance from "../../server";
import { extractLinks, stripHtml } from "../../assets/Font/quillConfig";
import dayjs from "dayjs";

const PostDetail: React.FC = () => {
  const { slug} = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsItem | null>(null);

  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await instance.get(`/news/${slug}`);
        setArticle(response.data.data);

        // Fetch related posts
        const relatedResponse = await instance.get(
          `/filterNewByMovie/${response.data.data.movie.id}`
        );
        if (relatedResponse.data.status) {
          setRelatedPosts(relatedResponse.data.data);
        }
        console.log(relatedResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      }
    };

    fetchArticle();
  }, [slug]);

 

  // Định dạng ngày tháng
  const formattedDate = dayjs(article?.created_at).format("DD/MM/YYYY ");

  return (
    <>
      <Header />
      <div className="article-container">
        <div className="main-content">
          <h1 className="article-title">{article?.title}</h1>
          <p className="article-meta">
            {article?.news_category.news_category_name} · {formattedDate}
          </p>

          <div className="article-content-container">
            <img
              src={article?.movie.poster || undefined}
              alt="Poster"
              className="article-poster"
            />
            <div className="article-movie-info">
              <h2>{stripHtml(article?.movie.movie_name  ?? "Tên phim không khả dụng")}</h2>

              <span>khởi chiếu:{article?.movie.release_date}</span>
              {/* Bạn có thể thêm các thông tin khác nếu cần */}
            </div>
            <button className="article-button">
              <Link to={`/movie-detail/${article?.movie.slug}`}>
                Mua vé ngay
              </Link>
            </button>
          </div>

          <p className="article-description">{stripHtml(article?.content  ?? "Nội dung không khả dụng")}</p>

          {/* Nếu bạn muốn giữ lại nội dung ban đầu, bạn có thể thêm phần nội dung ở đây */}
        </div>

        <div className="card card-article">
          <div className="card-header ">
            <div className="card-header-title">
              <p>Bài viết liên quan</p>
            </div>
          </div>
          {relatedPosts.map((post) => (
            <div className="card-body-1">
              <div className="row">
                <div className="col-auto">
                  <img
                    src={post.thumnail}
                    alt={post.title}
                    className="post-image"
                  />
                </div>
              </div>
              <div>
              
                <p className="post-meta-2">
                <Link to={`/postdetail/${post.slug}`}>  {stripHtml(post.content.slice(0, 150))}...</Link>
                </p>
                {/* <p className="post-meta">
                  Đánh giá phim • {post.user_name} •{" "}
                  {dayjs(post.created_at).format("DD/MM/YYYY")}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PostDetail;
