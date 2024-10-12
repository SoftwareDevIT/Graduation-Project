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

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [moviesPerPage] = useState<number>(5);

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
        if (window.confirm('Are you sure you want to delete this movie?')) {
            await instance.delete(`/movies/${id}`);
            dispatch({ type: 'DELETE_MOVIE', payload: id });
        }
    };

    // Pagination logic
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="movies-dashboard">
            <div className="actions">
                <Link to={`/admin/movies/add`} className="add-movie-btn">Add New Movie</Link>
            </div>
            <div className="table-container-movie">
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
                        {Array.isArray(currentMovies) && currentMovies.length > 0 ? (
                            currentMovies.map((movie: Movie) => (
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
                                        <Link to={`/admin/movies/edit/${movie.id}`} className="edit-btn">✏️</Link>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteMovie(movie.id)}
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
            {/* Pagination Section */}
            <div className="pagination">
                <button 
                    className="prev-btn" 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {Array.from({ length: Math.ceil(movies.length / moviesPerPage) }, (_, index) => (
                    <button 
                        key={index + 1}
                        className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button 
                    className="next-btn" 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={indexOfLastMovie >= movies.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MoviesDashboard;
