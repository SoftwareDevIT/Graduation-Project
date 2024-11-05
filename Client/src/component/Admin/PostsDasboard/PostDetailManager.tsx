import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePostsContext } from '../../../Context/PostContext';
import './PostDashboard.css'
const PostDetailManager: React.FC = () => {
  const { postId } = useParams<{ postId: string }>(); // Lấy ID từ URL
  const { state } = usePostsContext();
  const { posts } = state;

  // Tìm bài viết dựa trên ID
  const post = posts.find((p) => p.id === Number(postId));

  if (!post) {
    return <div className="text-center">Không tìm thấy bài viết.</div>;
  }

  return (
    <div className="container post-detail mt-5">
      <h1 className="display-4 mb-4 text-primary font-weight-bold">{post.title}</h1>
      <p className="text-muted mb-2">Ngày xuất bản: {new Date(post.created_at).toLocaleDateString()}</p>
      <p className="text-muted mb-4">Thể loại: {post.news_category_id}</p>
      <img src={post.thumnail} alt={post.title} className="img-fluid rounded mb-4" />
      <p className="content">{post.content}</p>
      <div className="text-center mt-5">
        <Link to="/admin/posts" className="btn btn-secondary btn-lg">Quay lại danh sách bài viết</Link>
      </div>
    </div>
  );
};

export default PostDetailManager;
