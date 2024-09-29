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

    const handleDeletePost = async (postId: number) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await instance.delete(`/news/${postId}`); // Gọi API để xóa bài viết
                setPosts(posts.filter(post => post.id !== postId)); // Cập nhật trạng thái để loại bỏ bài viết đã xóa
                alert("Post deleted successfully!"); // Thông báo thành công
            } catch (error) {
                console.error("Failed to delete post:", error);
                alert("Failed to delete post"); // Thông báo thất bại
            }
        }
    };

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
                            <th>Thumbnail</th>
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
                                    <img src={post.thumnail} alt={post.title} style={{ width: '40px', height: '40px' }} />
                                </td>
                                <td>{post.news_category_id}</td>
                                <td>{post.user_id}</td>
                                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                <td>{post.status}</td>
                                <td className="action-buttons">
                                    <button className="view-btn">👁</button>
                                    <button className="edit-btn">✏️</button>
                                    <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>🗑</button> {/* Gọi hàm xóa */}
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
