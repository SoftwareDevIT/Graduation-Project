import React, { useEffect, useState } from "react";
import "./TinTuc.css";
import Footer from "../Footer/Footer";
import MovieDetail from "./MovieDetail";
import instance from "../../server";
import { stripHtml } from '../../assets/Font/quillConfig';
const TinTuc: React.FC = () => {
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

    useEffect(() => {
        // Fetch data from the API
        instance.get("/filterNewByMovie/1")
            .then(response => {
                if (response.data.status) {
                    setRelatedPosts(response.data.data);
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
                                            <a href="#" className="post-title">{post.title}</a>
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
