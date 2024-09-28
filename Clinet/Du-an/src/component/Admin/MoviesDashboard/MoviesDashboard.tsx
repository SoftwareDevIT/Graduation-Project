import React, { useContext } from 'react';
import './MoviesDashboard.css';

import { useMovieContext } from '../../../Context/MoviesContext';

const MoviesDashboard: React.FC = () => {
    const { state, deleteMovie } = useMovieContext();
    const { movies } = state;

    return (
        <div className="movies-dashboard">
            <h2>Movie Management</h2>
            <div className="actions">
                <button className="add-movie-btn">Add New Movie</button>
            </div>
            <div className="table-container">
                <table className="movie-table">
                    <thead>
                        <tr>
                            <th>Movie ID</th>
                            <th>Title</th>
                            <th>Genre</th>
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
                                    <td>{movie.movie_category_id}</td>
                                    <td>{movie.duraion}</td>
                                    <td className="action-buttons">
                                        <button className="view-btn">👁</button>
                                        <button className="edit-btn">✏️</button>
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
                                <td colSpan={5}>No movies available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MoviesDashboard;
