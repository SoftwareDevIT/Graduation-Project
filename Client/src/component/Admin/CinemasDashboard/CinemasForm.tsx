import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { Cinema } from "../../../interface/Cinema";
import { Location } from "../../../interface/Location";
import { Movie } from "../../../interface/Movie";  // Import Movie interface
import { useCinemaContext } from "../../../Context/CinemasContext";

// Định nghĩa schema kiểm tra cho biểu mẫu Cinema
const cinemaSchema = z.object({
  cinema_name: z.string().min(1, "Cinema Name is required."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .regex(/^[0-9]+$/, "Phone number must be numeric."),
  cinema_address: z.string().min(1, "Cinema Address is required."),
  location_id: z.string().nonempty("Location ID is required."),
});

const CinemaForm = () => {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { addCinema, updateCinema } = useCinemaContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Cinema>({
    resolver: zodResolver(cinemaSchema),
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [cinema, setCinema] = useState<Cinema | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await instance.get(`/location`);
        setLocations(data.data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    const fetchCinema = async () => {
      if (isEditMode) {
        try {
          const { data } = await instance.get(`/cinema/${id}`);
          setCinema(data.data);
          reset(data.data);
          setSelectedMovies(data.data.movies.map((movie: Movie) => movie.id.toString())); // Convert ID to string
        } catch (error) {
          console.error("Failed to fetch cinema:", error);
        }
      }
    };

    const fetchMovies = async () => {
      try {
        const { data } = await instance.get(`/movies`);
        setMovies(data.data.original);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchLocations();
    fetchCinema();
    fetchMovies();
  }, [id, isEditMode, reset]);

  const handleFormSubmit = async (data: Cinema) => {
    try {
      if (isEditMode) {
        await updateCinema(Number(id), data);
        alert("Cinema updated successfully!");
      } else {
        await addCinema(data);
        alert("Cinema added successfully!");
      }
      nav('/admin/cinemas');
      reset();
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Failed to submit form");
    }
  };

  const handleAddMoviesToCinema = async () => {
    try {
      // Create an array of objects with the structure { movie_id: movieId }
      const moviePayload = selectedMovies.map(movieId => ({ movie_id: movieId }));
      
      console.log("Selected Movies Payload:", moviePayload); // Log the payload
  
      // Send the formatted data to the API
      await instance.post(`/add-movie-in-cinema/${id}`, { movie_in_cinema: moviePayload });
      alert("Movies added to cinema successfully!");
      nav('/admin/cinemas');
    } catch (error) {
      console.error("Failed to add movies to cinema:", error);
      alert("Failed to add movies to cinema");
    }
  };


  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="shadow p-4 rounded bg-light">
        <h1 className="text-center mb-4">{isEditMode ? "Edit Cinema" : "Add Cinema"}</h1>

        {/* Trường Cinema Name */}
        <div className="mb-3">
          <label htmlFor="cinema_name" className="form-label">Cinema Name</label>
          <input
            type="text"
            className={`form-control ${errors.cinema_name ? "is-invalid" : ""}`}
            {...register("cinema_name")}
            defaultValue={cinema?.cinema_name || ""}
          />
          {errors.cinema_name && <span className="text-danger">{errors.cinema_name.message}</span>}
        </div>

        {/* Trường Phone */}
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="text"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            {...register("phone")}
            defaultValue={cinema?.phone || ""}
          />
          {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
        </div>

        {/* Trường Cinema Address */}
        <div className="mb-3">
          <label htmlFor="cinema_address" className="form-label">Cinema Address</label>
          <input
            type="text"
            className={`form-control ${errors.cinema_address ? "is-invalid" : ""}`}
            {...register("cinema_address")}
            defaultValue={cinema?.cinema_address || ""}
          />
          {errors.cinema_address && <span className="text-danger">{errors.cinema_address.message}</span>}
        </div>

        {/* Trường Location */}
        <div className="mb-3">
          <label htmlFor="location_id" className="form-label">Location</label>
          <select
            {...register("location_id")}
            className={`form-control ${errors.location_id ? "is-invalid" : ""}`}
            defaultValue={cinema?.location_id || ""}
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.location_name}
              </option>
            ))}
          </select>
          {errors.location_id && <span className="text-danger">{errors.location_id.message}</span>}
        </div>

        {/* Trường Chọn Phim */}
        <div className="mb-3">
          <label htmlFor="movies" className="form-label">Select Movies</label>
          <select
            multiple
            className="form-control"
            value={selectedMovies}  // Đảm bảo kiểu dữ liệu là string[]
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedMovies(selected);
            }}
          >
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id.toString()}>
                {movie.movie_name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Cinema" : "Add Cinema"}
        </button>

        {isEditMode && (
          <button
            type="button"
            className="btn btn-secondary mt-3"
            onClick={handleAddMoviesToCinema}
          >
            Add Selected Movies to Cinema
          </button>
        )}
      </form>
    </div>
  );
};

export default CinemaForm;
