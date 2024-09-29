import React, { useState, useEffect } from 'react';

import ReactPaginate from 'react-paginate';



import './ShowtimesDashboard.css';
import { Showtime } from '../../../interface/Showtimes';
import instance from '../../../server';

const ShowtimesDashboard: React.FC = () => {
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const itemsPerPage = 2; // Số lượng showtime trên mỗi trang
    const [currentPage, setCurrentPage] = useState(0);


    useEffect(() => {
        const fetchShowtimes = async () => {
            try {

                const response = await instance.get('/showtimes'); // Cập nhật endpoint nếu cần

                const response = await instance.get<{ data: Showtime[] }>('/showtimes');

                console.log('API Response:', response.data);
                
                if (Array.isArray(response.data.data)) {
                    setShowtimes(response.data.data);
                } else {
                    console.error('Định dạng phản hồi không mong đợi', response.data);
                    setError('Không thể lấy showtime: Định dạng phản hồi không mong đợi');
                }
                setLoading(false);
            } catch (err) {
                console.error('Lỗi lấy dữ liệu:', err);
                setError('Không thể lấy showtime');
                setLoading(false);
            }
        };

        fetchShowtimes();
    }, []);


    const pageCount = Math.ceil(showtimes.length / itemsPerPage);
    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const currentShowtimes = showtimes.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);


    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="showtimes-management">

            <h2>Quản lý Showtime</h2>
            <div className="actions">
                <button className="add-showtime-btn">Thêm Showtime Mới</button>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h3>Danh Sách Showtime</h3>
                    <div className="add-showtime-container">
                        <button className="add-showtime-btn">Thêm Showtime Mới</button>
                    </div>
                </div>
                <table className="showtime-table">
                    <thead>
                        <tr>
                            <th>Phim</th>
                            <th>Rạp</th>
                            <th>Ngày</th>
                            <th>Giờ</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>

                        {Array.isArray(currentShowtimes) && currentShowtimes.length > 0 ? (
                            currentShowtimes.map((showtime) => (
                                <tr key={showtime.id}>
                                    <td>{showtime.movie.movie_name}</td>
                                    <td>{showtime.movie.cinema.cinema_name}</td>  
                                    <td>{showtime.showtime_date}</td>
                                    <td>{showtime.showtime_start}</td>
                                    <td className="action-buttons">
                                        <button className="view-btn">👁</button>
                                        <button className="edit-btn">✏️</button>
                                        <button className="delete-btn">🗑</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}>Không có showtime nào</td>

                        {showtimes.map((showtime) => (
                            <tr key={showtime.id}>
                                <td>{showtime.movie.movie_name}</td>
                                <td>{showtime.movie.cinema.cinema_name}</td>  
                                <td>{showtime.showtime_date}</td>
                                <td>{showtime.showtime_start}</td>
                                <td className="action-buttons">
                                    <button className="view-btn">👁</button>
                                    <button className="edit-btn">✏️</button>
                                    <button className="delete-btn">🗑</button>
                                </td>

                            </tr>
                        )}
                    </tbody>
                </table>
                <ReactPaginate
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={4}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    activeClassName={"active"}
                />
            </div>
        </div>
    );
};

export default ShowtimesDashboard;
