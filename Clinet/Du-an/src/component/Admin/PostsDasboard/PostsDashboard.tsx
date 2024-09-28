import React from 'react';

import './PostDashboard.css';
import { usePostsContext } from '../../../Context/PostContext';
import { Link } from 'react-router-dom';

const PostsDashboard = () => {
  const { state, deletePost } = usePostsContext();
  const { posts } = state;

  const handleDeletePost = async (postId: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      alert("Post deleted successfully!");
    }
  };

  return (
    <div className="posts-management">
      <h2>Post Management</h2>
      <div className="actions">
        <button className="add-post-btn" onClick={() => window.location.href = '/admin/posts/add'}>Add New Post</button>
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
                  <Link to={`/admin/posts/edit/${post.id}`} className="edit-btn">✏️</Link>
                  <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>🗑</button>
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
