// MoviesDashboard.tsx
import React from 'react';
import './MoviesDashboard.css';
import { Link } from 'react-router-dom';
import { useMoviesContext } from '../../../Context/MoviesContext';

const MoviesDashboard: React.FC = () => {
  const { state, deleteMovie } = useMoviesContext();
  const { movies } = state;

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      await deleteMovie(id);
    }
  };

  return (
    <div className="movies-dashboard">
      <h2>Movie Management</h2>
      <div className="actions">
        <Link to="/admin/movies/add" className="add-movie-btn">Add New Movie</Link>
      </div>
      <div className="table-container">
        <table className="movie-table">
          <thead>
            <tr>
              <th>Movie ID</th>
              <th>Title</th>
              <th>Poster</th>
              <th>Category ID</th>
              <th>Actor ID</th>
              <th>Director ID</th>
              <th>Duration</th>
              <th>Release Date</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>{movie.movie_name}</td>
                  <td>
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.movie_name} className="movie-poster" />
                    ) : (
                      <span>No Poster Available</span>
                    )}
                  </td>
                  <td>{movie.movie_category_id}</td>
                  <td>{movie.actor_id}</td>
                  <td>{movie.director_id}</td>
                  <td>{movie.duraion}</td>
                  <td>{movie.release_date}</td>
                  <td>{movie.description}</td>
                  <td>
                    <Link to={`/admin/movies/edit/${movie.id}`} className="edit-btn">Edit</Link>
                    <button onClick={() => handleDelete(movie.id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10}>No movies found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoviesDashboard;
