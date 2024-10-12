import React, { useState } from 'react';
import './PostDashboard.css';
import { usePostsContext } from '../../../Context/PostContext';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../../interface/NewsItem';

const PostsDashboard: React.FC = () => {
  const { state, deletePost } = usePostsContext();
  const { posts } = state;

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3; // Số bài viết hiển thị trên mỗi trang
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Lấy các bài viết theo trang hiện tại
  const currentPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handleDeletePost = async (postId: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      alert("Post deleted successfully!");
      setCurrentPage(1); // Quay về trang đầu sau khi xóa
    }
  };

  // Hàm để xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="posts-management">
      <h2>Post Management</h2>
      <div className="actions">
        <Link to="/admin/posts/add">
          <button className="add-post-btn">Add New Post</button>
        </Link>
      </div>
      <div className="table-container-posts">
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
            {currentPosts.length > 0 ? (
              currentPosts.map((post: NewsItem) => (
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
                <td colSpan={7} style={{ textAlign: 'center' }}>
                  No posts available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Phân trang */}
      <div className="pagination">
        <button
          className="prev-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="next-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostsDashboard;
