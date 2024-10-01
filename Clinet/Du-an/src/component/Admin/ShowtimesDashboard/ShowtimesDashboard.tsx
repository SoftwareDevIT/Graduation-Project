import React, { useState, useEffect } from 'react';

import './ShowtimesDashboard.css';
import { Showtime } from '../../../interface/Showtimes';
import instance from '../../../server';

const ShowtimesDashboard: React.FC = () => {
    const [showtimes, setShowtimes] = useState<Showtime[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
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
                                    <button className="edit-btn">✏️</button>
                                    <button className="delete-btn">🗑</button>
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