import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import instance from '../../../server'; 
import { useCinemaContext } from '../../../Context/CinemasContext';
import { Movie } from '../../../interface/Movie';
import { MovieInCinema } from '../../../interface/MovieInCinema'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; 

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
    const [searchTerm, setSearchTerm] = useState<string>(''); // State cho tìm kiếm

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

    const currentCinemas = cinemas
        .filter(cinema => 
            cinema.cinema_name &&
            cinema.cinema_name.toLowerCase().includes(searchTerm.toLowerCase())
        ) // Lọc các rạp chiếu phim theo từ khóa tìm kiếm
        .slice((currentPage - 1) * cinemasPerPage, currentPage * cinemasPerPage);

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
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">Cinemas Dashboard</h2>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/cinemas/add'} className="btn btn-outline-primary">Add Cinema</Link>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control w-25"  
                />
            </div>
            <div className="table-responsive">
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="thead-light">
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
                                            style={{ color: 'rgba(var(--bs-primary-rgb)', cursor: 'pointer' }}
                                        >
                                            {cinema.cinema_name}
                                        </span>
                                    </td>
                                    <td>{cinema.phone}</td>
                                    <td>{cinema.cinema_address}</td>
                                    <td>{cinema.status}</td>
                                    <td className="action-buttons1">
                                        <Link to={`/admin/cinemas/edit/${cinema.id}`} className="btn btn-warning btn-sm mx-1">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                        <button onClick={() => handleDeleteCinema(cinema.id!)} className="btn btn-danger btn-sm">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                                {expandedCinemaId === cinema.id && selectedCinemaMovies.length > 0 && (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="movies-list">
                                                <h4>Movies in Cinema {cinema.cinema_name}</h4>
                                                <ul className="list-unstyled">
                                                    {selectedCinemaMovies.map(movie => (
                                                        <li key={movie.id} className="d-flex justify-content-between align-items-center">
                                                            <span>{movie.movie_id}</span>
                                                            <button 
                                                                onClick={() => handleDeleteMovie(cinema.id!, movie.movie_id)}
                                                                className="btn btn-danger btn-sm"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
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
                                <td colSpan={6} className="text-center">
                                    No cinemas available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination d-flex justify-content-center mt-4">
                <button
                    className="btn btn-outline-secondary mx-2"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="btn btn-outline-secondary mx-2"
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
