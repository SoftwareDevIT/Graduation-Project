import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CinemasDashboard.css';
import instance from '../../../server'; 
import { useCinemaContext } from '../../../Context/CinemasContext';
import { Movie } from '../../../interface/Movie';
import { MovieInCinema } from '../../../interface/MovieInCinema'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import Font Awesome
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

const CinemasDashboard: React.FC = () => {
    const { state, dispatch } = useCinemaContext();
    const { cinemas } = state;

    const [currentPage, setCurrentPage] = useState(1);
    const cinemasPerPage = 5; 
    const totalCinemas = cinemas.length;
    const totalPages = Math.ceil(totalCinemas / cinemasPerPage);

    const [expandedCinemaId, setExpandedCinemaId] = useState<number | null>(null);
    const [selectedCinemaMovies, setSelectedCinemaMovies] = useState<MovieInCinema[]>([]);
    const [allMovies, setAllMovies] = useState<Movie[]>([]); 

    useEffect(() => {
        const fetchAllMovies = async () => {
            try {
                const response = await instance.get('/movies'); 
                setAllMovies(response.data.data.original); 
            } catch (error) {
                console.error("Failed to fetch movies:", error);
                alert("Failed to fetch movies.");
            }
        };

        fetchAllMovies();
    }, []);

    const currentCinemas = cinemas.slice((currentPage - 1) * cinemasPerPage, currentPage * cinemasPerPage);

    const handleDeleteCinema = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this cinema?")) {
            try {
                await instance.delete(`/cinema/${id}`);
                dispatch({ type: 'DELETE_CINEMA', payload: id });
                alert("Cinema deleted successfully!");
            } catch (err) {
                console.error("Failed to delete cinema:", err);
                alert("Failed to delete cinema");
            }
        }
    };

    const fetchMoviesForCinema = async (cinemaId: number) => {
        try {
            const response = await instance.get(`/show-movie-in-cinema/${cinemaId}`);
            const moviesInCinema = response.data.data; 
    
            console.log(moviesInCinema);
    
            const moviesWithNames = moviesInCinema.map((movie: MovieInCinema) => {
                const movieDetails = allMovies.find(m => m.id === movie.movie_id);
                return {
                    ...movie,
                    movie_name: movieDetails ? movieDetails.movie_name : 'Unknown Movie',
                };
            });
    
            setSelectedCinemaMovies(moviesWithNames);
        } catch (error) {
            console.error("Failed to fetch movies for cinema:", error);
            alert("Failed to fetch movies for this cinema.");
        }
    };
    
    const handleCinemaClick = (cinemaId: number) => {
        if (expandedCinemaId === cinemaId) {
            setExpandedCinemaId(null); 
            setSelectedCinemaMovies([]); 
        } else {
            fetchMoviesForCinema(cinemaId); 
            setExpandedCinemaId(cinemaId); 
        }
    };

    const handleDeleteMovie = async (cinemaId: number, movieId: number) => {
        if (window.confirm("Are you sure you want to delete this movie from the cinema?")) {
            try {
                await instance.delete(`/cinema/${cinemaId}/movie/${movieId}`);
                const updatedMovies = selectedCinemaMovies.filter(movie => movie.movie_id !== movieId);
                setSelectedCinemaMovies(updatedMovies);
                alert("Movie deleted successfully from cinema!");
            } catch (error) {
                console.error("Failed to delete movie from cinema:", error);
                alert("Failed to delete movie from cinema.");   
            }
        }
    };
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setExpandedCinemaId(null); 
        setSelectedCinemaMovies([]); 
    };

    return (
        <div className="cinemas-dashboard">
            <h2>All Cinemas</h2>
            <div className="actions">
                <Link to={'/admin/cinemas/add'} className="add-cinema-btn">Add Cinema</Link>
            </div>
            <div className="table-container-cinemas">
                <table className="cinema-table">
                    <thead>
                        <tr>
                            <th>Cinema ID</th>
                            <th>Cinema Name</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCinemas.map((cinema) => (
                            <React.Fragment key={cinema.id}>
                                <tr>
                                    <td>{cinema.id}</td>
                                    <td>
                                        <span 
                                            onClick={() => handleCinemaClick(cinema.id!)} 
                                            style={{ color: '#00796b', cursor: 'pointer', textDecoration: '' }}
                                        >
                                            {cinema.cinema_name}
                                        </span>
                                    </td>
                                    <td>{cinema.phone}</td>
                                    <td>{cinema.cinema_address}</td>
                                    <td>{cinema.status}</td>
                                    <td className="action-buttons">
                                        <Link to={`/admin/cinemas/edit/${cinema.id}`} className="edit-btn">
                                            <FontAwesomeIcon icon={faEdit} /> {/* Edit icon */}
                                        </Link>
                                        <button onClick={() => handleDeleteCinema(cinema.id!)} className="delete-btn">
                                            <FontAwesomeIcon icon={faTrash} /> {/* Delete icon */}
                                        </button>
                                    </td>
                                </tr>
                                {expandedCinemaId === cinema.id && selectedCinemaMovies.length > 0 && (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="movies-list">
                                                <h4>Movies in Cinema {cinema.cinema_name}</h4>
                                                <ul>
                                                    {selectedCinemaMovies.map(movie => (
                                                        <li key={movie.id}>
                                                            {movie.movie_id} 
                                                            <button 
                                                                onClick={() => handleDeleteMovie(cinema.id!, movie.movie_id)}
                                                                style={{
                                                                    backgroundColor: 'transparent',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    fontSize: '16px', 
                                                                    color: 'red',
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} /> {/* Delete icon for movie */}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {currentCinemas.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>
                                    No cinemas available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    className="prev-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="next-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CinemasDashboard;
