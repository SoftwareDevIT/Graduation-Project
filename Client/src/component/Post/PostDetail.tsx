import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PostDetail.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import { NewsItem } from '../../interface/NewsItem';
import instance from '../../server';
import { stripHtml } from '../../assets/Font/quillConfig';
import dayjs from 'dayjs'; // Import dayjs

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await instance.get(`/news/${id}`);
                setArticle(response.data.data);
            } catch (error) {
                console.error("Error fetching article:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!article) {
        return <p>Không tìm thấy bài viết</p>;
    }

    // Định dạng ngày tháng
    const formattedDate = dayjs(article.created_at).format('DD/MM/YYYY HH:mm');

    return (
        <>
            <Header />
            <div className="article-container">
                <div className="main-content">
                    <h1 className="article-title">{article.title}</h1>
                    <p className="article-meta">
                        {article.news_category.news_category_name} · {formattedDate}
                    </p>

                    <div className="article-content-container">
                        <img src={article.thumnail} alt="Poster" className="article-poster" />
                        <div className="article-movie-info">
                            <h2>{stripHtml(article.title)}</h2>
                            {/* Bạn có thể thêm các thông tin khác nếu cần */}
                        </div>
                        <button className="article-button">Mua vé ngay</button>
                    </div>

                    <p className="article-description">{stripHtml(article.content)}</p>
                    {/* Nếu bạn muốn giữ lại nội dung ban đầu, bạn có thể thêm phần nội dung ở đây */}
                </div>

                <div className="card card-article">
                    <div className="card-header ">
                        <div className='card-header-title'><p>Bài viết liên quan</p></div>
                    </div>
                    <div className="card-body">
                        <div className='row'>
                            <div className='col-auto'>
                                <img src="https://cdn.moveek.com/storage/media/cache/medium/66fbd1877a77f600683533.png" alt="Related" className="related-image" />
                            </div>
                        </div>
                        <div>
                            <p>Ra rạp xem gì tháng 10? – Mùa phim hành động, kinh dị hoành tráng</p>
                            <p className="related-meta">miduynph · 25 ngày trước</p>
                        </div>
                    </div>
                    
                </div>
                
            </div>
            <Footer />
        </>
    );
};

export default PostDetail;
