import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CinemasDashboard.css';
import instance from '../../../server'; // Đảm bảo bạn có đường dẫn chính xác
import { useCinemaContext } from '../../../Context/CinemasContext';
import { Movie } from '../../../interface/Movie';
import { Showtime } from '../../../interface/Showtimes';

const CinemasDashboard: React.FC = () => {
    const { state, dispatch } = useCinemaContext();
    const { cinemas } = state;

    const [currentPage, setCurrentPage] = useState(1);
    const cinemasPerPage = 5; // Số lượng rạp trên mỗi trang
    const totalCinemas = cinemas.length;
    const totalPages = Math.ceil(totalCinemas / cinemasPerPage);

    const [expandedCinemaId, setExpandedCinemaId] = useState<number | null>(null);
    const [selectedCinemaMovies, setSelectedCinemaMovies] = useState<Showtime[]>([]); // State để lưu trữ phim của rạp đã chọn
    const [allMovies, setAllMovies] = useState<Movie[]>([]); // State để lưu danh sách tất cả các phim

    // Lấy danh sách tất cả các phim khi component mount
    useEffect(() => {
        const fetchAllMovies = async () => {
            try {
                const response = await instance.get('/movies'); // Gọi API để lấy danh sách tất cả các phim
                setAllMovies(response.data.data.original); // Giả sử response.data.data là mảng phim
            } catch (error) {
                console.error("Failed to fetch movies:", error);
                alert("Failed to fetch movies.");
            }
        };

        fetchAllMovies();
    }, []);

    // Lấy rạp cho trang hiện tại
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

    // Lấy danh sách phim cho rạp cụ thể
    const fetchMoviesForCinema = async (cinemaId: number) => {
        try {
            const response = await instance.get(`/show-movie-in-cinema/${cinemaId}`);
            const moviesInCinema: Showtime[] = response.data.data; // Giả sử data là mảng showtime

            // Ánh xạ tên phim dựa trên movie_in_cinema_id
            const moviesWithNames = moviesInCinema.map((showtime: Showtime) => {
                const movie = allMovies.find((m: Movie) => m.id === showtime.movie_in_cinema_id); // Lấy ID từ showtime
                return {
                    ...showtime,
                    movie_name: movie ? movie.movie_name : 'Unknown Movie', // Gán tên phim
                };
            });

            setSelectedCinemaMovies(moviesWithNames);
        } catch (error) {
            console.error("Failed to fetch movies for cinema:", error);
            alert("Failed to fetch movies for this cinema.");
        }
    };

    // Xử lý sự kiện bấm vào tên rạp
    const handleCinemaClick = (cinemaId: number) => {
        if (expandedCinemaId === cinemaId) {
            setExpandedCinemaId(null); // Nếu rạp đang mở rộng, thu hẹp lại
            setSelectedCinemaMovies([]); // Xóa danh sách phim
        } else {
            fetchMoviesForCinema(cinemaId); // Lấy phim cho rạp này
            setExpandedCinemaId(cinemaId); // Mở rộng rạp đã chọn
        }
    };

    // Xử lý xóa phim trong rạp
    const handleDeleteMovie = async (cinemaId: number, movieId: number) => {
        if (window.confirm("Are you sure you want to delete this movie from the cinema?")) {
            try {
                await instance.delete(`/cinema/${cinemaId}/movie/${movieId}`);
                // Cập nhật lại danh sách phim
                const updatedMovies = selectedCinemaMovies.filter(movie => movie.id !== movieId);
                setSelectedCinemaMovies(updatedMovies);
                alert("Movie deleted successfully from cinema!");
            } catch (error) {
                console.error("Failed to delete movie from cinema:", error);
                alert("Failed to delete movie from cinema.");
            }
        }
    };

    // Xử lý thay đổi trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setExpandedCinemaId(null); // Reset ID rạp khi thay đổi trang
        setSelectedCinemaMovies([]); // Xóa danh sách phim khi thay đổi trang
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
                                        <Link to={`/admin/cinemas/edit/${cinema.id}`} className="edit-btn">✏️</Link>
                                        <button onClick={() => handleDeleteCinema(cinema.id!)} className="delete-btn">🗑</button>
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
                                                            {movie.movie_id} {/* Hiển thị tên phim */}
                                                            <button 
    onClick={() => handleDeleteMovie(cinema.id!, movie.id!)} 
    style={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px', 
        color: 'red',
    }}
>
    🗑
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

            {/* Phân trang */}
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
