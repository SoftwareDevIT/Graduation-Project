import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShowtimeContext } from '../../../Context/ShowtimesContext';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import { notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ShowtimesDashboard: React.FC = () => {
    const { state, dispatch } = useShowtimeContext();
    const { showtimes } = state;
    const [error, setError] = useState<string | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showtimesPerPage] = useState<number>(5);
    const [totalShowtimes, setTotalShowtimes] = useState<number>(0);  // Total showtimes to calculate total pages

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await instance.get(`/showtimes?page=${currentPage}`);
                if (response.data.data.data && Array.isArray(response.data.data.data)) {
                    dispatch({ type: 'SET_SHOWTIMES', payload: response.data.data.data });
                    setTotalShowtimes(response.data.data.total);  // Assuming the response contains the total count of showtimes
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
    }, [dispatch, currentPage, showtimesPerPage]);

    const filteredShowtimes = showtimes.filter(showtime =>
        showtime.movie_in_cinema?.movie?.movie_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteShowtime = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa showtime này?')) {
            try {
                await instance.delete(`/showtimes/${id}`);
                dispatch({ type: 'DELETE_SHOWTIME', payload: id });
                notification.success({
                    message: 'Xóa Thành Công',
                    description: 'Showtime đã được xóa thành công!',
                });
            } catch (err) {
                notification.error({
                    message: 'Lỗi Xóa Showtime',
                    description: 'Không thể xóa showtime. Vui lòng thử lại sau.',
                });
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Pagination calculations
    const totalPages = Math.ceil(totalShowtimes / showtimesPerPage);

    // Pagination handler
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Determine the range of pages to show
    const pageNumbers = [];
    const pageLimit = 5; // Maximum number of pages to display
    const startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
    const endPage = Math.min(totalPages, startPage + pageLimit - 1);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Link to="/admin/showtimes/add" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    <FontAwesomeIcon icon={faPlus} /> Thêm Suất Chiếu
                </Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên phim"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-1/4"
                />
            </div>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-600">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-center">Phim</th>
                            <th className="px-4 py-2 text-center">Phòng</th>
                            <th className="px-4 py-2 text-center">Ngày</th>
                            <th className="px-4 py-2 text-center">Giờ bắt đầu</th>
                            <th className="px-4 py-2 text-center">Giờ kết thúc</th>
                            <th className="px-4 py-2 text-center">Giá</th>
                            <th className="px-4 py-2 text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredShowtimes.slice(0, showtimesPerPage).map((showtime) => (
                            <tr key={showtime.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-center">{showtime.movie_in_cinema?.movie?.movie_name}</td>
                                <td className="px-4 py-3 text-center">{showtime.room?.room_name}</td>
                                <td className="px-4 py-3 text-center">{new Date(showtime.showtime_date).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-center">{showtime.showtime_start}</td>
                                <td className="px-4 py-3 text-center">{showtime.showtime_end}</td>
                                <td className="px-4 py-3 text-center">{formatCurrency(showtime.price)}</td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center space-x-3">
                                        <Link
                                            to={`/admin/showtimes/edit/${showtime.id}`}
                                            className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center hover:bg-yellow-200 transition"
                                        >
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
                                            onClick={() => deleteShowtime(showtime.id)}
                                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-6">
                <nav className="flex space-x-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
                    >
                        Trước
                    </button>

                    {/* Page Numbers */}
                    {pageNumbers.map((pageNumber) => (
                        <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-4 py-2 rounded-lg border ${currentPage === pageNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {pageNumber}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
                    >
                        Tiếp
                    </button>
                </nav>
            </div>
        </div>
    );
};


export default ShowtimesDashboard;
