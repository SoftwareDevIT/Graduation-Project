import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostsContext } from '../../../Context/PostContext';
import instance from '../../../server'; // Adjust path if necessary
import { NewsCategory } from '../../../interface/NewsCategory';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { notification } from 'antd'; // Import Ant Design notification

// Define the Zod schema for validation
const postSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(100,'Tiêu đề tối đa 100 ký tự'), // Title is required
  news_category_id: z.string().min(1, 'Chọn một danh mục'), // Category is required
  content: z.string().min(1, 'Nội dung là bắt buộc'), // Content is required
});

type FormData = z.infer<typeof postSchema>;

const PostsForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(postSchema), // Using Zod schema for validation
  });
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const { addOrUpdatePost } = usePostsContext();
  const nav = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await instance.get('/news_category');
        setCategories(Array.isArray(categoryResponse.data.data) ? categoryResponse.data.data : []);

        if (id) {
          const postResponse = await instance.get(`/news/${id}`);
          const postData = postResponse.data.data;
          console.log(postData);

          reset({
            title: postData.title,
            news_category_id: postData.news_category_id,
            content: postData.content,
          });
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu bài viết:', error);
      }
    };

    fetchCategories();
  }, [id, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log('ID danh mục đã chọn:', data.news_category_id);
    await addOrUpdatePost(
      {
        ...data,
        thumnail: thumbnailFile,
        banner: bannerFile,
      },
      id
    );

    // Replace alert with Ant Design notification
    notification.success({
      message: id ? 'Cập nhật bài viết thành công!' : 'Thêm bài viết thành công!',
      description: 'Bài viết của bạn đã được lưu thành công.',
      placement: 'topRight',
    });

    nav('/admin/posts');
  };

  return (
    <div className="container mt-5">
      <h2>{id ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
        <div className="mb-3">
          <label className="form-label">Tiêu đề:</label>
          <input
            type="text"
            className="form-control"
            {...register('title')}
          />
          {errors.title && <span className="text-danger">{errors.title.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Danh mục tin tức:</label>
          <select {...register('news_category_id')} className="form-select">
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.news_category_name}
              </option>
            ))}
          </select>
          {errors.news_category_id && <span className="text-danger">{errors.news_category_id.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Ảnh thu nhỏ:</label>
          <input
            type="file"
            className="form-control d-block"
            onChange={(e) => {
              if (e.target.files) {
                setThumbnailFile(e.target.files[0]);
              }
            }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ảnh bìa:</label>
          <input
            type="file"
            className="form-control d-block"
            onChange={(e) => {
              if (e.target.files) {
                setBannerFile(e.target.files[0]);
              }
            }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nội dung:</label>
          <textarea
            className="form-control"
            {...register('content')}
          ></textarea>
          {errors.content && <span className="text-danger">{errors.content.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary">
          {id ? 'Cập nhật bài viết' : 'Thêm bài viết'}
        </button>
      </form>
    </div>
  );
};

export default PostsForm;
