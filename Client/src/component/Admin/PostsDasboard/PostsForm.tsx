import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostsContext } from '../../../Context/PostContext';
import instance from '../../../server'; // Adjust the path as needed
import { NewsCategory } from '../../../interface/NewsCategory';

const PostsForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, reset } = useForm();
  const [categories, setCategories] = useState<NewsCategory[]>([]); // For post categories
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
            news_category_id: postData.news_category_id, // This will set the category ID
            content: postData.content,
          
          });
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchCategories();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    console.log('Selected Category ID:', data.news_category_id); // Log the selected category ID
    await addOrUpdatePost(
      
      {
        ...data,
        thumnail: thumbnailFile, // Use 'thumbnail' instead of 'thumbnailFile'
        banner: bannerFile, // Use 'banner' instead of 'bannerFile'
      },
      id
     
    );
    alert(id ? 'Post updated successfully!' : 'Post added successfully!');
    nav('/admin/posts'); // Redirect after submission
  };

  return (
    <div className="container mt-5">
      <h2>{id ? 'Edit Post' : 'Add Post'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="form-control"
            {...register('title')}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">News Category:</label>
          <select {...register('news_category_id')} className="form-select" required>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.news_category_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label ">Thumbnail:</label>
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
          <label className="form-label">Banner:</label>
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
          <label className="form-label">Content:</label>
          <textarea
            className="form-control"
            {...register('content')}
            required
          ></textarea>
        </div>
      
        <button type="submit" className="btn btn-primary">
          {id ? 'Update Post' : 'Add Post'}
        </button>
      </form>
    </div>
  );
};

export default PostsForm;