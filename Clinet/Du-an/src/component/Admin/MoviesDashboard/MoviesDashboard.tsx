import React from 'react';
import './MoviesDashboard.css';


import { Link } from 'react-router-dom';

const MoviesDashboard: React.FC = () => {
    const { state, deleteMovie } = useMovieContext();
    const { movies } = state;
 
    return (
        <div className="movies-dashboard">
            <h2>Movie Management</h2>
            <div className="actions">
                <Link to={`/admin/movies/add`} className="add-movie-btn">Add New Movie</Link>
            </div>
            <div className="table-container">
                <table className="movie-table">
                    <thead>
                        <tr>
                            <th>Movie ID</th>
                            <th>Title</th>
                            <th>Thumbnail</th>
                            <th>Movie Category</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(movies) && movies.length > 0 ? (
                            movies.map((movie) => (
                                <tr key={movie.id}>
                                    <td>{movie.id}</td>
                                    <td>{movie.movie_name}</td>
                                    <td>
                                        <img src={movie.poster ?? undefined} style={{ width: "40px", height: "40px" }} alt={`${movie.movie_name} poster`} />
                                    </td>
                                    <td>
                                        {movie.movie_category_id}
                                    </td>
                                    <td>{movie.duraion}</td>
                                    <td className="action-buttons">
                                        <button className="view-btn">👁</button>
                                        <Link to={`/admin/movies/edit/${movie.id}`} className="edit-btn">✏️</Link>
                                        <button
                                            className="delete-btn"
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete ${movie.movie_name}?`)) {
                                                    deleteMovie(movie.id);
                                                }
                                            }}
                                        >
                                            🗑
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>No movies available</td>
                            </tr>
                        )}
                        </tbody>
                </table>
            </div>
        </div>
    );
};

export default MoviesDashboard;

function useMovieContext(): { state: any; deleteMovie: any; } {
  throw new Error('Function not implemented.');
}
