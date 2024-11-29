import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCinemaContext } from '../../../Context/CinemasContext';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import { MovieInCinema } from '../../../interface/MovieInCinema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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
                className={`btn ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-blue-600'} mx-1 px-4 py-2 rounded-md`}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
            >
                {page}
            </button>
        ));
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Link to={'/admin/cinemas/add'} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <FontAwesomeIcon icon={faPlus} />  Thêm Rạp
                </Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-1/4"
                />
            </div>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-600">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-center">ID</th>
                            <th className="px-4 py-2 text-center">Tên Rạp</th>
                            <th className="px-4 py-2 text-center">Điện Thoại</th>
                            <th className="px-4 py-2 text-center">Vị Trí</th>
                            <th className="px-4 py-2 text-center">Địa Chỉ</th>
                            <th className="px-4 py-2 text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCinemas.map((cinema) => (
                            <React.Fragment key={cinema.id}>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center">{cinema.id}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span 
                                            onClick={() => handleCinemaClick(cinema.id!)} 
                                            style={{ color: 'rgba(var(--bs-primary-rgb)', cursor: 'pointer' }}
                                        >
                                            {cinema.cinema_name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">{cinema.phone}</td>
                                    <td className="px-4 py-3 text-center">{cinema.location.location_name}</td>
                                    <td className="px-4 py-3 text-center">{cinema.location.location_name}</td>
                                    <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center space-x-3">
                                        <Link to={`/admin/cinemas/${cinema.id}/edit`}  className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center hover:bg-yellow-200 transition">
                                        <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.439 19.274a4.5 4.5 0 01-1.691 1.074l-3.003 1.001 1.001-3.003a4.5 4.5 0 011.074-1.691L16.862 3.487z"
                                                />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteCinema(cinema.id!)}
                                           className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedCinemaId === cinema.id && (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="bg-gray-100 p-4">
                                                <h4 className="text-lg font-semibold mb-4">Các Phim Trong Rạp</h4>
                                                <table className="w-full table-auto text-sm">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-4 py-2">Tên Phim</th>
                                                            <th className="px-4 py-2 text-center">Hành Động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedCinemaMovies.map((movie) => (
                                                            <tr key={movie.movie_id}>
                                                                <td className="px-4 py-2">{movie.movie.movie_name}</td>
                                                                <td className="px-4 py-2 text-center">
                                                                    <button
                                                                        onClick={() => handleDeleteMovie(cinema.id!, movie.movie_id)}
                                                                        className="text-red-600"
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4">
                {renderPagination()}
            </div>
        </div>
    );
};

export default CinemasDashboard;
