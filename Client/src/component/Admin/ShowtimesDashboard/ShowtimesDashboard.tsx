import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShowtimeContext } from '../../../Context/ShowtimesContext';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import { notification } from 'antd'; // Import Ant Design notification
import 'bootstrap/dist/css/bootstrap.min.css';

const ShowtimesDashboard: React.FC = () => {
    const { state, dispatch } = useShowtimeContext();
    const { showtimes } = state; // Truyền lại showtimes từ context
    const [error, setError] = useState<string | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    

    // Fetch showtimes và movies từ API
    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await instance.get(`/showtimes?page=${currentPage}`);
                if (Array.isArray(response.data.data.data)) {
                    dispatch({ type: 'SET_SHOWTIMES', payload: response.data.data.data });
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
    }, [dispatch, currentPage]);

    // Lọc showtimes theo tên phim
    const filteredShowtimes = showtimes.filter(showtime =>
        showtime.movie_in_cinema?.movie?.movie_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Xử lý xóa showtime
    const deleteShowtime = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa showtime này?')) {
            try {
                await instance.delete(`/showtimes/${id}`);
                dispatch({ type: 'DELETE_SHOWTIME', payload: id });

                // Thông báo thành công
                notification.success({
                    message: 'Xóa Thành Công',
                    description: 'Showtime đã được xóa thành công!',
                });
            } catch (err) {
                // Thông báo lỗi
                notification.error({
                    message: 'Lỗi Xóa Showtime',
                    description: 'Không thể xóa showtime. Vui lòng thử lại sau.',
                });
            }
        }
    };

    // Định dạng giá tiền
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container mt-5">
           
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/admin/showtimes/add" className="btn btn-outline-primary">+ Thêm Suất Chiếu</Link>
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
                        {filteredShowtimes.length > 0 ? (
                            filteredShowtimes.map((showtime) => (
                                <tr key={showtime.id}>
                                    <td>{showtime.movie_in_cinema?.movie?.movie_name}</td>
                                    <td>{showtime.room?.room_name}</td>
                                    <td>{new Date(showtime.showtime_date).toLocaleDateString()}</td>
                                    <td>{showtime.showtime_start}</td>
                                    <td>{showtime.showtime_end}</td>
                                    <td>{formatCurrency(showtime.price)}</td>
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
                                <td colSpan={7} className="text-center">Không có showtimes nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <nav className="d-flex justify-content-center mt-4">
                <div className="pagination">
                    <button
                        className="btn btn-outline-primary mx-1"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                         Trước
                    </button>
                    <button className="btn btn-outline-primary mx-1">{currentPage}</button>
                    <button
                        className="btn btn-outline-primary mx-1"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Sau 
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default ShowtimesDashboard;
