import React, { useState, useEffect } from 'react';
import './ShowtimesDashboard.css';
import { Link } from 'react-router-dom';

import { useShowtimeContext } from '../../../Context/ShowtimesContext';
import instance from '../../../server';

import { Movie } from '../../../interface/Movie'; // Import Movie if needed

const ShowtimesDashboard: React.FC = () => {
    const { state, dispatch } = useShowtimeContext();
    const { showtimes } = state;
    const [error, setError] = useState<string | null>(null);
    
    const [movies, setMovies] = useState<Movie[]>([]); // To store movies if needed
    console.log(movies);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const showtimesPerPage = 3; // Number of showtimes per page
    const totalShowtimes = showtimes.length;
    const totalPages = Math.ceil(totalShowtimes / showtimesPerPage);

    // Get current showtimes for the current page
    const currentShowtimes = showtimes.slice(
        (currentPage - 1) * showtimesPerPage,
        currentPage * showtimesPerPage
    );

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await instance.get('/showtimes');
                if (Array.isArray(response.data.data)) {
                    dispatch({ type: 'SET_SHOWTIMES', payload: response.data.data });
                    console.log(response.data.data);
                } else {
                    setError('Không thể lấy showtime: Định dạng phản hồi không mong đợi');
                }
            } catch (err) {
                setError('Không thể lấy showtime');
            }
        };

       

        const fetchMovies = async () => {
            try {
                const movieResponse = await instance.get('/movies'); // Đảm bảo endpoint này là chính xác
                if (Array.isArray(movieResponse.data.data.original
                )) {
                    setMovies(movieResponse.data.data.original
                    );
                } else {
                    setError('Không thể lấy danh sách phim: Định dạng phản hồi không mong đợi');
                }
            } catch (err) {
                console.error(err); // In ra lỗi để dễ dàng debug
                setError('Không thể lấy danh sách phim');
            }
        };
        

        
        fetchShowtimes();
        fetchMovies(); // Fetch movies to use later
    }, [dispatch]);

    const deleteShowtime = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa showtime này?')) {
            try {
                await instance.delete(`/showtimes/${id}`);
                dispatch({ type: 'DELETE_SHOWTIME', payload: id });
                alert('Showtime đã được xóa thành công!');
                const updatedTotalShowtimes = totalShowtimes - 1;
                const updatedTotalPages = Math.ceil(updatedTotalShowtimes / showtimesPerPage);
                if (currentPage > updatedTotalPages && updatedTotalPages > 0) {
                    setCurrentPage(updatedTotalPages);
                }
            } catch (err) {
                alert('Không thể xóa showtime. Vui lòng thử lại sau.');
            }
        }
    };

    // Function to handle page changes
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="showtimes-management">
            <h2>Quản lý Showtime</h2>
            <div className="actions">
                <Link to="/admin/showtimes/add" className="add-showtime-btn">Thêm Showtime Mới</Link>
            </div>
            <div className="table-pagination-container">
                <div className="table-container1">
                    <table className="showtime-table">
                        <thead>
                            <tr>
                                <th>Phim</th>
                                <th>Ngày</th>
                                <th>Giờ bắt đầu</th>
                                <th>Giờ kết thúc</th>
                                <th>Giá</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentShowtimes.length > 0 ? (
                                currentShowtimes.map((showtime) => (
                                    <tr key={showtime.id}>
                                        <td>
                                            {showtime.movie_in_cinema_id}
                                        </td>
                                        <td>{new Date(showtime.showtime_date).toLocaleDateString()}</td>
                                        <td>{showtime.showtime_start}</td>
                                        <td>{showtime.showtime_end}</td>
                                        <td>{showtime.price}</td>
                                        <td className="action-buttons">
                                            <Link to={`/admin/showtimes/edit/${showtime.id}`} className="edit-btn">✏️</Link>
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteShowtime(showtime.id)}
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center' }}>
                                        No showtimes available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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
        </div>
    );
};

export default ShowtimesDashboard;
