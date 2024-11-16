 import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShowtimeContext } from '../../../Context/ShowtimesContext';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import 'bootstrap/dist/css/bootstrap.min.css';

const ShowtimesDashboard: React.FC = () => {
    const { state, dispatch } = useShowtimeContext();
    const { showtimes } = state;
    const [error, setError] = useState<string | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const showtimesPerPage = 6;

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await instance.get('/showtimes');
                if (Array.isArray(response.data.data)) {
                    dispatch({ type: 'SET_SHOWTIMES', payload: response.data.data });
                } else {
                    setError('Không thể lấy showtime: Định dạng phản hồi không mong đợi');
                }
            } catch (err) {
                setError('Không thể lấy showtime');
            }
        };

        const fetchMovies = async () => {
            try {
                const movieResponse = await instance.get('/movies');
                if (Array.isArray(movieResponse.data.data.original)) {
                    setMovies(movieResponse.data.data.original);
                } else {
                    setError('Không thể lấy danh sách phim: Định dạng phản hồi không mong đợi');
                }
            } catch (err) {
                setError('Không thể lấy danh sách phim');
            }
        };

        fetchShowtimes();
        fetchMovies();
    }, [dispatch]);

    const filteredShowtimes = showtimes.filter(showtime =>
        showtime.movie_in_cinema?.movie?.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalShowtimes = filteredShowtimes.length;
    const totalPages = Math.ceil(totalShowtimes / showtimesPerPage);
    const currentShowtimes = filteredShowtimes.slice(
        (currentPage - 1) * showtimesPerPage,
        currentPage * showtimesPerPage
    );

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

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">Quản lý Showtime</h2>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/admin/showtimes/add" className="btn btn-outline-primary">Thêm Showtime Mới</Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên phim"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control w-25"  
                />
            </div>
            <div className="table-responsive">
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="thead-light">
                        <tr>
                            <th>Phim</th>
                            <th>Phòng</th>
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
                                    <td>{showtime.movie_in_cinema.movie.movie_name}</td>
                                    <td>{showtime.room_id}</td>
                                    <td>{new Date(showtime.showtime_date).toLocaleDateString()}</td>
                                    <td>{showtime.showtime_start}</td>
                                    <td>{showtime.showtime_end}</td>
                                    <td>{showtime.price}</td>
                                    <td>
                                        <div className="d-flex justify-content-around">
                                            <Link to={`/admin/showtimes/edit/${showtime.id}`} className="btn btn-warning btn-sm mr-2">
                                                <i className="fas fa-edit"></i>
                                            </Link>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteShowtime(showtime.id)}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center">Không có showtimes nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Trước</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Tiếp theo</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ShowtimesDashboard;
