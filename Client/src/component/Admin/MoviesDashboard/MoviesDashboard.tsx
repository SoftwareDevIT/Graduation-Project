import React, { useEffect, useState } from 'react';
import './MoviesDashboard.css';
import { useMovieContext } from '../../../Context/MoviesContext';
import { Link } from 'react-router-dom';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const MoviesDashboard: React.FC = () => {
    const { state, dispatch } = useMovieContext();
    const { movies } = state;

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [moviesPerPage] = useState<number>(5);
    const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movieResponse = await instance.get('/movies');
                dispatch({ type: 'SET_MOVIES', payload: movieResponse.data.data.original });
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, [dispatch]);

    const deleteMovie = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            try {
                await instance.delete(`/movies/${id}`);
                dispatch({ type: 'DELETE_MOVIE', payload: id });
                alert("Movie deleted successfully!");
            } catch (error) {
                console.error('Error deleting movie:', error);
                alert("Failed to delete movie.");
            }
        }
    };

    // Pagination logic
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;

    // Filter movies by search term (search across all movies)
    const filteredMovies = Array.isArray(movies) 
        ? movies.filter(movie => 
            movie.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
          ) 
        : [];

    // Paginate filtered movies
    const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="movies-dashboard">
            <div className="actions">
                <Link to={`/admin/movies/add`} className="add-movie-btn">Add New Movie</Link>
                <input
                    type="text"
                    placeholder="Search by movie name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="table-container-movie">
                <table className="movie-table">
                    <thead>
                        <tr>
                            <th>Movie ID</th>
                            <th>Title</th>
                            <th>Thumbnail</th>
                            <th>Category</th>
                            <th>Actors</th>
                            <th>Director</th>
                            <th>Duration</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMovies.length > 0 ? (
                            currentMovies.map((movie: Movie) => (
                                <tr key={movie.id}>
                                    <td>{movie.id}</td>
                                    <td>{movie.movie_name}</td>
                                    <td>
                                        <img src={movie.poster ?? undefined} style={{ width: "40px", height: "40px" }} alt={`${movie.movie_name} poster`} />
                                    </td>
                                    <td>
                                        {movie.category.map(category => category.category_name).join(', ')}
                                    </td>
                                    <td>
                                        {movie.actor.map(actor => actor.actor_name).join(', ')}
                                    </td>
                                    <td>
                                        {movie.director.map(director => director.director_name).join(', ')}
                                    </td>
                                    <td>{movie.duration}</td>
                                    <td>{movie.description}</td>
                                    <td className="action-buttons">
                                        <Link to={`/admin/movies/edit/${movie.id}`} className="edit-btn">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteMovie(movie.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9}>No movies available</td>
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
                {Array.from({ length: Math.ceil(filteredMovies.length / moviesPerPage) }, (_, index) => (
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
                    disabled={indexOfLastMovie >= filteredMovies.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MoviesDashboard;
