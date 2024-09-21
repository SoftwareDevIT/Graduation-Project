import React from 'react';
import './ShowtimesDashboard.css';

const ShowtimesDashboard = () => {
    const showtimes = [
        { id: 1, movie: 'Movie A', cinema: 'Cinema 1', date: '2024-09-20', time: '14:00' },
        { id: 2, movie: 'Movie B', cinema: 'Cinema 2', date: '2024-09-21', time: '16:00' },
        { id: 3, movie: 'Movie C', cinema: 'Cinema 3', date: '2024-09-22', time: '18:00' },
    ];
    return (
        <div className="showtimes-management">
            <h2>Showtime Management</h2>
            <div className="actions">
                <button className="add-showtime-btn">Add New Showtime</button>
            </div>
            <div className="table-container">
                <table className="showtime-table">
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Cinema</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showtimes.map((showtime) => (
                            <tr key={showtime.id}>
                                <td>{showtime.movie}</td>
                                <td>{showtime.cinema}</td>
                                <td>{showtime.date}</td>
                                <td>{showtime.time}</td>
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
