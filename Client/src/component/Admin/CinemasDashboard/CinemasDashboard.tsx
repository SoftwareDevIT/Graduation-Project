import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import instance from '../../../server'; 
import { useCinemaContext } from '../../../Context/CinemasContext';
import { Movie } from '../../../interface/Movie';
import { MovieInCinema } from '../../../interface/MovieInCinema'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; 
import { notification } from 'antd';  // Import notification from Ant Design

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
                console.error("Lỗi khi lấy danh sách phim:", error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Lỗi khi lấy danh sách phim.',
                });
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
        if (window.confirm("Bạn có chắc chắn muốn xóa rạp này?")) {
            try {
                await instance.delete(`/cinema/${id}`);
                dispatch({ type: 'DELETE_CINEMA', payload: id });
                notification.success({
                    message: 'Thành công',
                    description: 'Xóa rạp thành công!',
                });
            } catch (err) {
                console.error("Lỗi khi xóa rạp:", err);
                notification.error({
                    message: 'Lỗi',
                    description: 'Lỗi khi xóa rạp.',
                });
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
                    movie_name: movieDetails ? movieDetails.movie_name : 'Phim không xác định',
                };
            });
            setSelectedCinemaMovies(moviesWithNames);
        } catch (error) {
            console.error("Lỗi khi lấy phim của rạp:", error);
            notification.error({
                message: 'Lỗi',
                description: 'Lỗi khi lấy phim của rạp này.',
            });
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
        if (window.confirm("Bạn có chắc chắn muốn xóa phim này khỏi rạp?")) {
            try {
                await instance.delete(`/cinema/${cinemaId}/movie/${movieId}`);
                const updatedMovies = selectedCinemaMovies.filter(movie => movie.movie_id !== movieId);
                setSelectedCinemaMovies(updatedMovies);
                notification.success({
                    message: 'Thành công',
                    description: 'Xóa phim khỏi rạp thành công!',
                });
            } catch (error) {
                console.error("Lỗi khi xóa phim khỏi rạp:", error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Lỗi khi xóa phim khỏi rạp.',
                });
            }
        }
    };
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setExpandedCinemaId(null); 
        setSelectedCinemaMovies([]); 
    };

    // Pagination với hiển thị giới hạn và dấu ba chấm
    const renderPagination = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pageNumbers.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pageNumbers.map((page, index) => (
            <button
                key={index}
                className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
            >
                {page}
            </button>
        ));
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">Quản Lí Rạp Chiếu Phim</h2>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/cinemas/add'} className="btn btn-outline-primary">+ Thêm Rạp</Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control w-25"  
                />
            </div>
            <div className="table-responsive">
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="thead-light">
                        <tr>
                            <th>ID</th>
                            <th>Tên Rạp</th>
                            <th>Điện Thoại</th>
                            <th>Vị Trí</th>
                            <th>Địa Chỉ</th>
                            <th>Hành Động</th>
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
                                    <td>{cinema.location.location_name}</td>
                                    <td>{cinema.cinema_address}</td>
                                    <td className="action-buttons1 d-flex justify-content-center align-items-center">
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
                                                <h4>Phim trong Rạp {cinema.cinema_name}</h4>
                                                <ul className="list-unstyled">
                                                    {selectedCinemaMovies.map(movie => (
                                                        <li key={movie.movie.id} className="d-flex justify-content-between align-items-center">
                                                            <span>{movie.movie.movie_name}</span>
                                                            <button 
                                                                onClick={() => handleDeleteMovie(cinema.id!, movie.movie_id)}
                                                                className="btn btn-danger btn-sm"
                                                            >
                                                                Xóa
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
                    </tbody>
                </table>
            </div>
            <div className="pagination-wrapper text-center">
                {renderPagination()}
            </div>
        </div>
    );
};

export default CinemasDashboard;
