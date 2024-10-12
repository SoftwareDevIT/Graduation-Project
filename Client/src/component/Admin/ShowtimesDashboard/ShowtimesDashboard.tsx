import React, { useState, useEffect } from 'react';
import './ShowtimesDashboard.css';
import { Link } from 'react-router-dom';
import { Showtime } from '../../../interface/Showtimes';
import { useShowtimeContext } from '../../../Context/ShowtimesContext';
import instance from '../../../server';
import { Cinema } from '../../../interface/Cinema';

const ShowtimesDashboard: React.FC = () => {
    const { state, dispatch } = useShowtimeContext();
    const { showtimes } = state;
    const [error, setError] = useState<string | null>(null);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const showtimesPerPage = 3; // Số showtime hiển thị trên mỗi trang
    const totalShowtimes = showtimes.length;
    const totalPages = Math.ceil(totalShowtimes / showtimesPerPage);

    // Lấy các showtime theo trang hiện tại
    const currentShowtimes = showtimes.slice(
        (currentPage - 1) * showtimesPerPage,
        currentPage * showtimesPerPage
    );

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await instance.get<{ data: Showtime[] }>('/showtimes');
                if (Array.isArray(response.data.data)) {
                    dispatch({ type: 'SET_SHOWTIMES', payload: response.data.data });
                } else {
                    setError('Không thể lấy showtime: Định dạng phản hồi không mong đợi');
                }
            } catch (err) {
                setError('Không thể lấy showtime');
            }
        };

        const fetchCinemas = async () => {
            try {
                const cinemaResponse = await instance.get<{ data: Cinema[] }>('/cinema');
                if (Array.isArray(cinemaResponse.data.data)) {
                    setCinemas(cinemaResponse.data.data);
                } else {
                    setError('Không thể lấy danh sách rạp: Định dạng phản hồi không mong đợi');
                }
            } catch (err) {
                setError('Không thể lấy danh sách rạp');
            }
        };

        fetchCinemas();
        fetchShowtimes();
    }, [dispatch]);

    const deleteShowtime = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa showtime này?')) {
            try {
                await instance.delete(`/showtimes/${id}`);
                dispatch({ type: 'DELETE_SHOWTIME', payload: id });
                alert('Showtime đã được xóa thành công!');
                // Kiểm tra nếu sau khi xóa, trang hiện tại không còn showtime nào thì quay về trang trước
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

    // Hàm để xử lý chuyển trang
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
                                <th>Rạp</th>
                                <th>Ngày</th>
                                <th>Giờ bắt đầu</th>
                                <th>Giờ kết thúc</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentShowtimes.length > 0 ? (
                                currentShowtimes.map((showtime) => (
                                    <tr key={showtime.id}>
                                        <td>{showtime.movie.movie_name}</td>
                                        <td>
                                            {cinemas.find(cinema => cinema.id === showtime.cinema_id)?.cinema_name || 'No Cinema'}
                                        </td>
                                        <td>{new Date(showtime.showtime_date).toLocaleDateString()}</td>
                                        <td>{showtime.showtime_start}</td>
                                        <td>{showtime.showtime_end}</td>
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
            </div>
      
    );
};

export default ShowtimesDashboard;
