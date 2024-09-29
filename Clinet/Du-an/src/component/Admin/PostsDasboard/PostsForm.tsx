import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import instance from '../../../server';
import { NewsItem } from '../../../interface/NewsItem';
import { usePostsContext } from '../../../Context/PostContext';

// Define the schema for form validation using Zod
const postSchema = z.object({
  title: z.string().min(1, "Title is required."),
  news_category_id: z.number().min(1, "Category ID is required."),
  thumnail: z.string().url("Thumbnail must be a valid URL."),
  banner: z.string().url("Banner must be a valid URL."),
  content: z.string().min(1, "Content is required."),
  status: z.enum(['Show', 'Hidden']),
});

const PostsForm = () => {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { addPost, updatePost } = usePostsContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<NewsItem>({
    resolver: zodResolver(postSchema),
  });

  const [post, setPost] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (isEditMode) {
        try {
          const { data } = await instance.get(`/news/${id}`);
          setPost(data.data);
          reset(data.data); // Reset the form with the fetched post data
        } catch (error) {
          console.error("Failed to fetch post:", error);
        }
      }
    };

    fetchPost();
  }, [id, isEditMode, reset]);

  const handleFormSubmit = async (data: NewsItem) => {
    try {
      console.log("Submitting Data:", data); // Log data
      if (isEditMode) {
        await updatePost(Number(id), data);
        alert("Post updated successfully!");
      } else {
        await addPost(data);
        alert("Post added successfully!");
      }
      nav('/admin/posts');
      reset();
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Failed to submit form");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <h1>{isEditMode ? "Edit Post" : "Add Post"}</h1>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            {...register("title")}
            defaultValue={post?.title || ""}
          />
          {errors.title && <span className="text-danger">{errors.title.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="thumnail" className="form-label">Thumbnail URL</label>
          <input
            type="text"
            className="form-control"
            {...register("thumnail")}
            defaultValue={post?.thumnail || ""}
          />
          {errors.thumnail && <span className="text-danger">{errors.thumnail.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="banner" className="form-label">Banner URL</label>
          <input
            type="text"
            className="form-control"
            {...register("banner")}
            defaultValue={post?.banner || ""}
          />
          {errors.banner && <span className="text-danger">{errors.banner.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            className="form-control"
            {...register("content")}
            defaultValue={post?.content || ""}
          />
          {errors.content && <span className="text-danger">{errors.content.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="news_category_id" className="form-label">Category ID</label>
          <input
            type="number"
            className="form-control"
            {...register("news_category_id")}
            defaultValue={post?.news_category_id || ""}
          />
          {errors.news_category_id && <span className="text-danger">{errors.news_category_id.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            {...register("status")}
            className="form-control"
            defaultValue={post?.status || ""}
          >
            <option value="">Select Status</option>
            <option value="Show">Show</option>
            <option value="Hidden">Hidden</option>
          </select>
          {errors.status && <span className="text-danger">{errors.status.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default PostsForm;
