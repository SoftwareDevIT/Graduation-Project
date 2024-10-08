// MoviesForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Movie } from '../../../interface/Movie';
import { useMoviesContext } from '../../../Context/MoviesContext';
import { useEffect } from 'react';

// Zod schema for form validation
const movieSchema = z.object({
  movie_name: z.string().min(1, 'Movie name is required.'),
//   movie_category_id: z.number().min(1, 'Category is required.'),
//   actor_id: z.number().min(1, 'Actor is required.'),
//   director_id: z.number().min(1, 'Director is required.'),
  rating: z.string().min(1, 'Rating is required.'),
  poster: z.string().url().optional(),
  duraion: z.string().optional(),
  release_date: z.string().optional(),
//   age_limit: z.number().optional(),
  description: z.string().optional(),
  trailer: z.string().optional(),
  status: z.enum(['Show', 'Hidden']),
});

const MoviesForm: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { addMovie, updateMovie, state } = useMoviesContext();

  const { handleSubmit, register, reset, formState: { errors } } = useForm<Movie>({
    resolver: zodResolver(movieSchema),
  });

  const movieToEdit = state.movies.find((movie) => movie.id === Number(id));

  useEffect(() => {
    if (isEditMode && movieToEdit) {
      reset(movieToEdit); // Populate form for editing
    }
  }, [isEditMode, movieToEdit, reset]);

  const onSubmit = async (data: Movie) => {
    try {
      if (isEditMode) {
        await updateMovie(Number(id), data);
        alert('Movie updated successfully!');
      } else {
        await addMovie(data);
        alert('Movie added successfully!');
      }
      nav('/admin/movies');
    } catch (error) {
      console.error('Failed to submit movie form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>{isEditMode ? 'Edit Movie' : 'Add Movie'}</h1>

      <div>
        <label>Movie Name</label>
        <input type="text" {...register('movie_name')} />
        {errors.movie_name && <span>{errors.movie_name.message}</span>}
      </div>

      <div>
        <label>Category ID</label>
        <input type="number" {...register('movie_category_id')} />
        {errors.movie_category_id && <span>{errors.movie_category_id.message}</span>}
      </div>

      <div>
        <label>Actor ID</label>
        <input type="number" {...register('actor_id')} />
        {errors.actor_id && <span>{errors.actor_id.message}</span>}
      </div>

      <div>
        <label>Director ID</label>
        <input type="number" {...register('director_id')} />
        {errors.director_id && <span>{errors.director_id.message}</span>}
      </div>

      <div>
        <label>Rating</label>
        <input type="text" {...register('rating')} />
        {errors.rating && <span>{errors.rating.message}</span>}
      </div>

      <div>
        <label>Poster URL</label>
        <input type="text" {...register('poster')} />
        {errors.poster && <span>{errors.poster.message}</span>}
      </div>

      <div>
        <label>Duration</label>
        <input type="text" {...register('duraion')} />
        {errors.duraion && <span>{errors.duraion.message}</span>}
      </div>

      <div>
        <label>Release Date</label>
        <input type="text" {...register('release_date')} />
        {errors.release_date && <span>{errors.release_date.message}</span>}
      </div>

      <div>
        <label>Age Limit</label>
        <input type="number" {...register('age_limit')} />
        {errors.age_limit && <span>{errors.age_limit.message}</span>}
      </div>

      <div>
        <label>Description</label>
        <textarea {...register('description')} />
        {errors.description && <span>{errors.description.message}</span>}
      </div>

      <div>
        <label>Trailer URL</label>
        <input type="text" {...register('trailer')} />
        {errors.trailer && <span>{errors.trailer.message}</span>}
      </div>

      <div>
        <label>Status</label>
        <select {...register('status')}>
          <option value="Show">Show</option>
          <option value="Hidden">Hidden</option>
        </select>
        {errors.status && <span>{errors.status.message}</span>}
      </div>

      <button type="submit">{isEditMode ? 'Update Movie' : 'Add Movie'}</button>
    </form>
  );
};

export default MoviesForm;
