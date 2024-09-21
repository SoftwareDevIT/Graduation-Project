import React from 'react';
import './PostDashboard.css';

const PostsDashboard = () => {
    const posts = [
        { id: 'POST001', title: 'React Basics', category: 'Programming', author: 'John Doe', date: '2024-09-10', status: 'Published' },
        { id: 'POST002', title: 'Getting started with Laravel', category: 'Web Development', author: 'Jane Doe', date: '2024-09-12', status: 'Draft' },
        { id: 'POST003', title: 'CSS Tricks for UI Design', category: 'Design', author: 'Alice Smith', date: '2024-09-13', status: 'Published' },
    ];
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
                                <td>{post.category}</td>
                                <td>{post.author}</td>
                                <td>{post.date}</td>
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
