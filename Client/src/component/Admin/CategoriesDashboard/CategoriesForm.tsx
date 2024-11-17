import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategoryContext } from '../../../Context/CategoriesContext';
import { MovieCategory } from '../../../interface/MovieCategory';
import instance from '../../../server';

// Define the schema for form validation using Zod
const categorySchema = z.object({
  category_name: z.string().min(1, 'Category Name is required.'),
});

const CategoriesForm = () => {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { addCategory, updateCategory } = useCategoryContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<MovieCategory>({
    resolver: zodResolver(categorySchema),
  });

  const [category, setCategory] = useState<MovieCategory | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (isEditMode) {
        try {
          const response = await instance.get(`/movie-category/${id}`);
          const fetchedCategory = response.data.data;
          setCategory(fetchedCategory);
          reset(fetchedCategory);
        } catch (error) {
          console.error('Failed to fetch category:', error);
        }
      }
    };

    fetchCategory();
  }, [id, isEditMode, reset]);

  const handleFormSubmit = async (data: MovieCategory) => {
    try {
      if (isEditMode) {
        await updateCategory(Number(id), data);
        alert('Category updated successfully!');
      } else {
        await addCategory(data);
        alert('Category added successfully!');
      }
      nav('/admin/categories');
      reset();
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Failed to submit form');
    }
  };

  if (isEditMode && !category) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="shadow-lg p-4 rounded bg-white">
        <h2 className="text-center mb-4 text-primary">{isEditMode ? 'Edit Category' : 'Add New Category'}</h2>

        <div className="form-group mb-3">
          <label htmlFor="category_name" className="form-label fw-bold">Category Name</label>
          <input
            type="text"
            className={`form-control ${errors.category_name ? 'is-invalid' : ''}`}
            {...register('category_name')}
            defaultValue={category?.category_name || ''}
          />
          {errors.category_name && (
            <div className="invalid-feedback">{errors.category_name.message}</div>
          )}
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary px-4 py-2">
            {isEditMode ? 'Update Category' : 'Add Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriesForm;
