import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";

import { Movie } from "../../../interface/Movie"; 

// Define the schema for form validation using Zod
const movieSchema = z.object({
  movie_name: z.string().min(1, "Movie Name is required."),
  rating: z.string().min(1, "Rating is required."),
  actor_id: z.number().int().positive("Actor ID must be a positive integer."),
  director_id: z.number().int().positive("Director ID must be a positive integer."),
  movie_category_id: z.number().int().positive("Movie Category ID is required."),
  release_date: z.string().nullable(),
  age_limit: z.number().nullable(),
  description: z.string().nullable(),
  trailer: z.string().nullable(),
  poster: z.string().nullable(),
  duraion: z.string().nullable(),
  status: z.enum(['Show', 'Hidden']),
});

const MoviesForm = () => {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  const isEditMode = Boolean(id);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Movie>({
    resolver: zodResolver(movieSchema),
  });

  const [movie, setMovie] = useState<Movie | null>(null); 

  useEffect(() => {
    const fetchMovie = async () => {
      if (isEditMode) {
        try {
          const { data } = await instance.get(`/movies/${id}`);
          setMovie(data.data);
          reset(data.data); 
        } catch (error) {
          console.error("Failed to fetch movie:", error);
        }
      }
    };

    fetchMovie();
  }, [id, isEditMode, reset]);

  const handleFormSubmit = async (data: Movie) => {
    try {
      if (isEditMode) {
        await instance.put(`/movies/${id}`, data);
        alert("Movie updated successfully!");
      } else {
        await instance.post('/movies', data);
        alert("Movie added successfully!");
      }
      nav('/admin/movies');
      reset(); 
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Failed to submit form");
    }
  };

  if (isEditMode && !movie) return <div>Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <h1>{isEditMode ? "Edit Movie" : "Add Movie"}</h1>

        <div className="mb-3">
          <label htmlFor="movie_name" className="form-label">Movie Name</label>
          <input
            type="text"
            className="form-control"
            {...register("movie_name")}
            defaultValue={movie?.movie_name || ""}
          />
          {errors.movie_name && <span className="text-danger">{errors.movie_name.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="rating" className="form-label">Rating</label>
          <input
            type="text"
            className="form-control"
            {...register("rating")}
            defaultValue={movie?.rating || ""}
          />
          {errors.rating && <span className="text-danger">{errors.rating.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="actor_id" className="form-label">Actor ID</label>
          <input
            type="number"
            className="form-control"
            {...register("actor_id")}
            defaultValue={movie?.actor_id || ""}
          />
          {errors.actor_id && <span className="text-danger">{errors.actor_id.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="director_id" className="form-label">Director ID</label>
          <input
            type="number"
            className="form-control"
            {...register("director_id")}
            defaultValue={movie?.director_id || ""}
          />
          {errors.director_id && <span className="text-danger">{errors.director_id.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="movie_category_id" className="form-label">Movie Category ID</label>
          <input
            type="number"
            className="form-control"
            {...register("movie_category_id")}
            defaultValue={movie?.movie_category_id || ""}
          />
          {errors.movie_category_id && <span className="text-danger">{errors.movie_category_id.message}</span>}
        </div>

        <div className="mb-3">
          <label htmlFor="release_date" className="form-label">Release Date</label>
          <input
            type="date"
            className="form-control"
            {...register("release_date")}
            defaultValue={movie?.release_date || ""}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="age_limit" className="form-label">Age Limit</label>
          <input
            type="number"
            className="form-control"
            {...register("age_limit")}
            defaultValue={movie?.age_limit || ""}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            {...register("description")}
            defaultValue={movie?.description || ""}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="trailer" className="form-label">Trailer URL</label>
          <input
            type="text"
            className="form-control"
            {...register("trailer")}
            defaultValue={movie?.trailer || ""}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="poster" className="form-label">Poster URL</label>
          <input
            type="text"
            className="form-control"
            {...register("poster")}
            defaultValue={movie?.poster || ""}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="duraion" className="form-label">Duration</label>
          <input
            type="text"
            className="form-control"
            {...register("duraion")}
            defaultValue={movie?.duraion || ""}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            {...register("status")}
            className="form-control"
            defaultValue={movie?.status || "Show"}
          >
            <option value="Show">Show</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Movie" : "Add Movie"}
        </button>
      </form>
    </div>
  );
};

export default MoviesForm;
