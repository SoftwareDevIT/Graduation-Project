import React, { useEffect, useState } from 'react';
import { useMovieContext } from '../../../Context/MoviesContext';
import { Link } from 'react-router-dom';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const MoviesDashboard: React.FC = () => {
    const { state, dispatch } = useMovieContext();
    const { movies } = state;

    // Loading and error states
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [moviesPerPage] = useState<number>(5);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movieResponse = await instance.get('/movies');
                dispatch({ type: 'SET_MOVIES', payload: movieResponse.data.data.original });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setError('Failed to load movies');
                setLoading(false);
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

    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;

    // Filter movies by search term
    const filteredMovies = Array.isArray(movies) 
        ? movies.filter(movie => 
            movie.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
          ) 
        : [];

    const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">Movies Dashboard</h2>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={`/admin/movies/add`} className="btn btn-outline-primary">Add New Movie</Link>
                <input
                    type="text"
                    placeholder="Search by movie name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control w-25"
                />
            </div>
            <div className="table-responsive">
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="thead-light">
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
                                        <img src={movie.poster ?? undefined} style={{ width: "60px", height: "90px" }} alt={`${movie.movie_name} poster`} />
                                    </td>
                                    <td>{movie.category.map(category => category.category_name).join(', ')}</td>
                                    <td>{movie.actor.map(actor => actor.actor_name).join(', ')}</td>
                                    <td>{movie.director.map(director => director.director_name).join(', ')}</td>
                                    <td>{movie.duration}</td>
                                    <td>{movie.description}</td>
                                    <td>
                                        <div className="d-flex justify-content-around">
                                            <Link to={`/admin/movies/edit/${movie.id}`} className="btn btn-warning btn-sm mr-2">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => deleteMovie(movie.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
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
            <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                            Previous
                        </button>
                    </li>
                    {Array.from({ length: Math.ceil(filteredMovies.length / moviesPerPage) }, (_, index) => (
                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${indexOfLastMovie >= filteredMovies.length ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default MoviesDashboard;
