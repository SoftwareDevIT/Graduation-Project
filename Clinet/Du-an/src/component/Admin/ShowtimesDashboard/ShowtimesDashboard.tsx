import React, { useState, useEffect } from 'react';
import './ShowtimesDashboard.css';
import { Link } from 'react-router-dom';
import { Showtime } from '../../../interface/Showtimes';
import { useShowtimeContext } from '../../../Context/ShowtimesContext'; // Import context
import instance from '../../../server';

const ShowtimesDashboard: React.FC = () => {
    const { state, dispatch } = useShowtimeContext(); // Lấy state và dispatch từ context
    const { showtimes } = state; // Truy cập showtimes từ state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await instance.get<{ data: Showtime[] }>('/showtimes');
                if (Array.isArray(response.data.data)) {
                    dispatch({ type: 'SET_SHOWTIMES', payload: response.data.data });
                } else {
                    setError('Không thể lấy showtime: Định dạng phản hồi không mong đợi');
                }
                setLoading(false);
            } catch (err) {
                setError('Không thể lấy showtime');
                setLoading(false);
            }
        };

        fetchShowtimes();
    }, [dispatch]);

    const deleteShowtime = async (id: number) => {
        await instance.delete(`/showtimes/${id}`);
        dispatch({ type: 'DELETE_SHOWTIME', payload: id });
    };

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
                <Link to="/admin/showtimes/add" className="add-showtime-btn">Thêm Showtime Mới</Link>
            </div>
            <div className="table-container">
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
                        {showtimes.map((showtime) => (
                            <tr key={showtime.id}>
                                <td>{showtime.movie.movie_name}</td>
                                <td>{showtime.movie.cinema.cinema_name}</td>  
                                <td>{showtime.showtime_date}</td>
                                <td>{showtime.showtime_start}</td>
                                <td className="action-buttons">
                                    <button className="view-btn">👁</button>
                                    <Link to={`/admin/showtimes/edit/${showtime.id}`} className="edit-btn">✏️</Link>
                                    <button
                                        className="delete-btn"
                                        onClick={() => {
                                            if (window.confirm(`Bạn có chắc chắn muốn xóa showtime này?`)) {
                                                deleteShowtime(showtime.id);
                                            }
                                        }}
                                    >
                                        🗑
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShowtimesDashboard;
