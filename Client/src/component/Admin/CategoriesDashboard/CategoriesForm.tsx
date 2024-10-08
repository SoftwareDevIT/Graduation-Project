import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategoryContext } from '../../../Context/CategoriesContext';
import { MovieCategory } from '../../../interface/MovieCategory';
import instance from '../../../server';

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
          // Access the 'data' property from the response
          const fetchedCategory = response.data.data; // Assuming your data is nested under 'data'
          setCategory(fetchedCategory);
          reset(fetchedCategory); // Populate the form with fetched data
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

  if (isEditMode && !category) return <div>Loading...</div>; // Loading state

  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <h1>{isEditMode ? 'Edit Category' : 'Add Category'}</h1>

        <div className="mb-3">
          <label htmlFor="category_name" className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            {...register('category_name')}
            defaultValue={category?.category_name || ''} // Bind the input value correctly
          />
          {errors.category_name && <span className="text-danger">{errors.category_name.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary">
          {isEditMode ? 'Update Category' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default CategoriesForm;
