// PostsAdd.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import instance from '../../../server';
import { NewsItem } from '../../../interface/NewsItem';


const newsSchema = z.object({
    title: z.string().min(1, "Title is required."),
    news_category_id: z.number().min(1, "Category ID is required."),
    thumnail: z.string().url("Must be a valid URL."),
    banner: z.string().url("Must be a valid URL."),
    content: z.string().min(1, "Content is required."),
    status: z.enum(['Show', 'Hidden']),
});

const PostsAdd = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsItem>({
        resolver: zodResolver(newsSchema),
    });

    const onSubmit = async (data: NewsItem) => {
        try {
            await instance.post('/news', data);
            alert("Post added successfully!");
            reset();
        } catch (error) {
            console.error("Failed to add post:", error);
            alert("Failed to add post");
        }
    };

    return (
        <div>
            <h1>Add New Post</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Title</label>
                    <input type="text" {...register("title")} />
                    {errors.title && <span>{errors.title.message}</span>}
                </div>
                <div>
                    <label>Category ID</label>
                    <input type="number" {...register("news_category_id", { valueAsNumber: true })} />
                    {errors.news_category_id && <span>{errors.news_category_id.message}</span>}
                </div>
                <div>
                    <label>Thumbnail URL</label>
                    <input type="text" {...register("thumnail")} />
                    {errors.thumnail && <span>{errors.thumnail.message}</span>}
                </div>
                <div>
                    <label>Content</label>
                    <textarea {...register("content")}></textarea>
                    {errors.content && <span>{errors.content.message}</span>}
                </div>
                <div>
                    <label>Status</label>
                    <select {...register("status")}>
                        <option value="Show">Show</option>
                        <option value="Hidden">Hidden</option>
                    </select>
                    {errors.status && <span>{errors.status.message}</span>}
                </div>
                <button type="submit">Add Post</button>
            </form>
        </div>
    );
};

export default PostsAdd;
