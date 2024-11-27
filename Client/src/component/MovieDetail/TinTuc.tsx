import React, { useEffect, useState } from "react";
import "./TinTuc.css";
import Footer from "../Footer/Footer";
import MovieDetail from "./MovieDetail";
import instance from "../../server";
import { stripHtml } from '../../assets/Font/quillConfig';
import { useMovieContext } from "../../Context/MoviesContext";
import { Link, useParams } from "react-router-dom";
const TinTuc: React.FC = () => {
    const { slug } = useParams(); // Sử dụng slug
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
    const { state } = useMovieContext(); // Lấy dữ liệu từ MovieContext
    const movie = state.movies.find((movie) => movie.slug === slug);
    useEffect(() => {
        // Fetch data from the API
        instance.get(`/filterNewByMovie/${movie?.id}`)
            .then(response => {
                if (response.data.status) {
                    setRelatedPosts(response.data.data);
                    console.log('du lieu',response.data.data)
                }
            })
            .catch(error => {
                console.error("There was an error fetching the related posts:", error);
            });
    }, []);

    return (
        <>
            <div>
                <MovieDetail />
                <div className="content">
                    <div className="container tintuccontainer">
                        <div className="title-2">
                            <h3>Bài viết liên quan</h3>
                        </div>
                        <div className="related-posts">
                            <div className="newcontent">
                                {relatedPosts.map((post) => (
                                    <div className="post" key={post.id}>
                                        <img
                                            src={post.thumnail}
                                            alt={post.title}
                                            className="post-image"
                                        />
                                        <div className="post-info">
                                            <a href="#" className="post-title"><Link to={`/postdetail/${post.slug}`}>{post.title}</Link></a>
                                            <p className="post-meta">Đánh giá phim • {post.user_id} • {new Date(post.created_at).toLocaleDateString()}</p>
                                            <p className="post-meta-2">{stripHtml(post.content.slice(0, 150))}...</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default TinTuc;
