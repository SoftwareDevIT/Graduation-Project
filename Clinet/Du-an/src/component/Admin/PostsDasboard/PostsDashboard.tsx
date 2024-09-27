import React, { useEffect, useState } from 'react';
import instance from '../../../server';

import './PostDashboard.css';
import { NewsItem } from '../../../interface/NewsItem';

const PostsDashboard = () => {
    const [posts, setPosts] = useState<NewsItem[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await instance.get('/news');
                setPosts(response.data.data); // Giả định dữ liệu có cấu trúc như bạn đã mô tả
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="posts-management">
            <h2>Post Management</h2>
            <div className="actions">
                <button className="add-post-btn">Add New Post</button>
            </div>
            <div className="table-container">
                <table className="post-table">
                    <thead>
                        <tr>
                            <th>Post ID</th>
                            <th>Title</th>
                            <th>Thumbnail</th> {/* Thêm cột Thumbnail */}
                            <th>Category</th>
                            <th>Author</th>
                            <th>Date Published</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id}>
                               
                                <td>{post.id}</td>
                                <td>{post.title}</td>
                                <td>
                                    <img src={post.thumnail} alt={post.title} style={{ width: '40px', height: '40px' }} /> {/* Hiển thị thumbnail */}
                                </td>
                                <td>{post.news_category_id}</td> {/* Cập nhật để lấy category */}
                                <td>{post.user_id}</td> {/* Cập nhật để lấy author */}
                                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                <td>{post.status}</td>
                                <td className="action-buttons">
                                    <button className="view-btn">👁</button>
                                    <button className="edit-btn">✏️</button>
                                    <button className="delete-btn">🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PostsDashboard;
