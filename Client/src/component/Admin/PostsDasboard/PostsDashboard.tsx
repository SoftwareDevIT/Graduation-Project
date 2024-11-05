import React, { useState } from 'react';
import { usePostsContext } from '../../../Context/PostContext';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../../interface/NewsItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PostDashboard.css';

const PostsDashboard: React.FC = () => {
  const { state, deletePost } = usePostsContext();
  const { posts } = state;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const postsPerPage = 3;
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Lọc các bài viết theo tên
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handleDeletePost = async (postId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      await deletePost(postId);
      alert("Xóa bài viết thành công!");
      setCurrentPage(1); 
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 display-4 text-dark font-weight-bold">Quản lý Bài viết</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/admin/posts/add" className="btn custom-btn">Thêm Bài viết Mới</Link>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control w-25"  
        />
      </div>

      {/* Thẻ cho từng bài viết */}
      <div className="row">
        {currentPosts.length > 0 ? (
          currentPosts.map((post: NewsItem) => (
            <div key={post.id} className="col-md-4 mb-4">
              <div className="card post-card h-100">
                <Link to={`/admin/posts/${post.id}`} className="card-img-top-link">
                  <img src={post.thumnail} className="card-img-top rounded" alt={post.title} />
                </Link>
                <div className="card-body d-flex flex-column">
                  <Link to={`/admin/posts/${post.id}`} className="card-title-link">
                    <h5 className="card-title text-primary font-weight-bold">{post.title}</h5>
                  </Link>
                  <p className="card-text text-muted">{post.content.slice(0, 400)}...</p>
                  <p className="text-muted small mb-1">Thể loại: {post.news_category_id}</p>
                  <p className="text-muted small mb-3">Ngày xuất bản: {new Date(post.created_at).toLocaleDateString()}</p>
                  <div className="d-flex justify-content-around mt-auto">
                    <Link to={`/admin/posts/edit/${post.id}`} className="btn btn-warning rounded-pill btn-sm px-3">
                      <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                    </Link>
                    <button className="btn btn-danger rounded-pill btn-sm px-3" onClick={() => handleDeletePost(post.id)}>
                      <FontAwesomeIcon icon={faTrash} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>Không có bài viết nào.</p>
          </div>
        )}
      </div>

      {/* Phân trang */}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Trước</button>
          </li>
          {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Sau</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PostsDashboard;
