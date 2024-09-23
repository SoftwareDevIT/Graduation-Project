import React, { useState, useEffect } from 'react';

import './MoviesDashboard.css';
import { Movie } from '../../../interface/Movie';
import instance from '../../../server';

const MoviesDashboard: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch movies from the API when the component mounts
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await instance.get('/movies');
                console.log('API Response:', response.data); // Log the entire response
    
                // Access the movies array from the response.data
                if (Array.isArray(response.data.data)) {
                    setMovies(response.data.data); // Set movies if it's an array
                } else {
                    console.error('Unexpected response format', response.data);
                    setError('Failed to fetch movies: Unexpected response format');
                }
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err); // Log the error
                setError('Failed to fetch movies');
                setLoading(false);
            }
        };
    
        fetchMovies();
    }, []);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
                                    <td>{movie.movie_name}</td> {/* Adjust to match your interface */}
                                    <td>{movie.movie_category_id}</td> {/* Replace with genre if needed */}
                                    <td>{movie.duraion}</td>
                                    <td className="action-buttons">
                                        <button className="view-btn">👁</button>
                                        <button className="edit-btn">✏️</button>
                                        <button className="delete-btn">🗑</button>
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
