import React, { useState, useEffect } from 'react';

import './CinemasDashboard.css';
import { Cinema } from '../../../interface/Cinema';
import instance from '../../../server';

const CinemasDashboard: React.FC = () => {
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCinemas = async () => {
            try {
                const response = await instance.get('/cinema');
                console.log('API Response:', response.data); // Log the entire response
                setCinemas(response.data.data);
                // Assuming response.data is an array of cinemas
                
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err); // Log the error
                setError('Failed to fetch cinemas');
                setLoading(false);
            }
        };

        fetchCinemas();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cinemas.map((cinema) => (
                            <tr key={cinema.id}>
                                <td>{cinema.id}</td>
                                <td>{cinema.cinema_name}</td>
                                <td>{cinema.phone}</td>
                                <td>{cinema.cinema_address}</td>
                                <td>{cinema.status}</td>
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
