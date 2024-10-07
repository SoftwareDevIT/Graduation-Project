import React from 'react';
import './PostDashboard.css';
import { usePostsContext } from '../../../Context/PostContext';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../../interface/NewsItem';

const PostsDashboard: React.FC = () => {
  const { state, deletePost } = usePostsContext();
  const { posts } = state;

  console.log(posts); // Debug log to check posts

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
        <Link to="/admin/posts/add">
          <button className="add-post-btn">Add New Post</button>
        </Link>
      </div>
      <div className="table-container">
        <table className="post-table">
          <thead>
            <tr>
              <th>Post ID</th>
              <th>Title</th>
              <th>Thumbnail</th>
              <th>Category</th>
             
              <th>Date Published</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post: NewsItem) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>
                    <img
                      src={post.thumnail}
                      alt={post.title}
                      style={{ width: '40px', height: '40px' }}
                    />
                  </td>
                  <td>{post.news_category_id}</td>
                
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td>{post.status}</td>
                  <td className="action-buttons">
                    <button className="view-btn">👁</button>
                    <Link to={`/admin/posts/edit/${post.id}`} className="edit-btn">✏️</Link>
                    <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>🗑</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>
                  No posts available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostsDashboard;
