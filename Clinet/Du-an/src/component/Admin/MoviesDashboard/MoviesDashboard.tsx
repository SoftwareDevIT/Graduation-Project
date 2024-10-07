import React, { useEffect, useState } from 'react';
import './MoviesDashboard.css';

import { useMovieContext } from '../../../Context/MoviesContext';
import { Link } from 'react-router-dom';
import instance from '../../../server';
import { Categories } from '../../../interface/Categories';
import { Movie } from '../../../interface/Movie';

const MoviesDashboard: React.FC = () => {
    const [categories, setCategories] = useState<Categories[]>([]);
    const { state, dispatch } = useMovieContext();
    const { movies } = state;
    
    useEffect(() => {
        const fetchCategories = async () => {
          const categoryResponse = await instance.get('/movie-category');
          setCategories(categoryResponse.data);
        };
      
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movieResponse = await instance.get('/movies');
                dispatch({ type: 'SET_MOVIES', payload: movieResponse.data.data });
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };
    
        fetchMovies();
    }, [dispatch]);
    

    const deleteMovie = async (id: number) => {
        await instance.delete(`/movies/${id}`);
        dispatch({ type: 'DELETE_MOVIE', payload: id });
    };

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
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(movies) && movies.length > 0 ? (
                            movies.map((movie: Movie) => (
                                <tr key={movie.id}>
                                    <td>{movie.id}</td>
                                    <td>{movie.movie_name}</td>
                                    <td>
                                        <img src={movie.poster ?? undefined} style={{ width: "40px", height: "40px" }} alt={`${movie.movie_name} poster`} />
                                    </td>
                                    <td>
                                        {categories.find(category => category.id === movie.movie_category_id)?.category_name || 'No Category'}
                                    </td>
                                    <td>{movie.duration}</td>
                                    <td>{movie.description}</td>
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
                                <td colSpan={7}>No movies available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MoviesDashboard;
