import React, { useState, useEffect } from 'react';
import './CinemasDashboard.css';
import { Cinema } from '../../../interface/Cinema';
import instance from '../../../server';
import { Link } from 'react-router-dom';

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
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err); // Log the error
                setError('Failed to fetch cinemas');
                setLoading(false);
            }
        };

        fetchCinemas();
    }, []);

    const handleDeleteCinema = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this cinema?")) {
            try {
                await instance.delete(`/cinema/${id}`); // Adjust your API endpoint if necessary
                // Filter out the deleted cinema from the state
                setCinemas(cinemas.filter(cinema => cinema.id !== id));
                alert("Cinema deleted successfully!");
            } catch (err) {
                console.error("Failed to delete cinema:", err);
                alert("Failed to delete cinema");
            }
        }
    };

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
                <Link to={'/admin/cinemas/add'} className="add-cinema-btn">Add Cinema</Link>
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
                                    <Link to={`/admin/cinemas/edit/${cinema.id}`} className="edit-btn">✏️</Link>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDeleteCinema(cinema.id!)} // Ensure id is defined
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

export default CinemasDashboard;
