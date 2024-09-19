import React from 'react';
import './CinemasDashboard.css';

const CinemasDashboard = () => {
    const cinemas = [
        { id: 'CIN001', name: 'Cinema 1', location: 'Downtown', capacity: 150 },
        { id: 'CIN002', name: 'Cinema 2', location: 'Uptown', capacity: 200 },
        { id: 'CIN003', name: 'Cinema 3', location: 'Suburbs', capacity: 100 },
    ];
    
    return (
        <div className="cinemas-dashboard">
            <h2>All Cinemas</h2>
            <div className="actions">
                <button className="add-cinema-btn">Add Cinema</button>
            </div>
            <div className="table-container">
                <table className="cinema-table">
                    <thead>
                        <tr>
                            <th>Cinema ID</th>
                            <th>Cinema Name</th>
                            <th>Location</th>
                            <th>Capacity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cinemas.map((cinema) => (
                            <tr key={cinema.id}>
                                <td>{cinema.id}</td>
                                <td>{cinema.name}</td>
                                <td>{cinema.location}</td>
                                <td>{cinema.capacity}</td>
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

export default CinemasDashboard;
