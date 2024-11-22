import React, { useState } from 'react';
import { usePostsContext } from '../../../Context/PostContext';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../../interface/NewsItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PostDashboard.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Import the styles

const PostsDashboard: React.FC = () => {
  const { state, deletePost } = usePostsContext();
  const { posts } = state;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const postsPerPage = 6; // Display more posts at once for the newspaper feel
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Filter posts by title
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

  // Show a truncated version of the content
  const truncateContent = (content: string, length: number) => {
    if (content.length <= length) return content;
    return `${content.slice(0, length)}...`;
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 display-3 text-dark font-weight-bold">Quản lý Bài viết</h2>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
      <Link to={'/admin/posts/add'} className="btn btn-outline-primary">
                   + Quản lý bài viết
                </Link>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control w-25"
        />
      </div>

      {/* Newspaper Layout (Multiple Columns) */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {currentPosts.length > 0 ? (
          currentPosts.map((post: NewsItem) => (
            <div key={post.id} className="col">
              <div className="card shadow border-0 h-100">
                <Link to={`/admin/posts/${post.id}`} className="card-img-top-link">
                  <img src={post.thumnail} className="card-img-top" alt={post.title} />
                </Link>
                <div className="card-body d-flex flex-column">
                  <Link to={`/admin/posts/${post.id}`} className="card-title-link">
                    <h5 className="card-title text-dark font-weight-bold">{post.title}</h5>
                  </Link>
                  <div className="card-text text-muted truncated-text">
                    <ReactQuill 
                      value={truncateContent(post.content, 200)}  // Truncate content to 100 characters
                      readOnly={true} 
                      theme="snow" 
                      modules={{ toolbar: false }}
                      formats={['bold', 'underline', 'link','image']}
                    />
                    {post.content.length > 100 && (
                      <Link to={`/admin/posts/${post.id}`} className="text-primary mt-2">Xem thêm</Link>
                    )}
                  </div>
                  <p className="text-muted small mt-auto mb-2">Thể loại: {post.news_category.news_category_name}</p>
                  <p className="text-muted small mb-3">Ngày xuất bản: {new Date(post.created_at).toLocaleDateString()}</p>
                  <div className="d-flex justify-content-between mt-auto">
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

      {/* Pagination */}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination pagination-lg">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Trước</button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
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
