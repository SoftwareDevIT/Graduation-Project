import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CinemasDashboard.css';

import instance from '../../../server'; // Ensure you have the correct path
import { useCinemaContext } from '../../../Context/CinemasContext';

const CinemasDashboard: React.FC = () => {
    const { state, dispatch } = useCinemaContext();
    const { cinemas } = state;

    const [currentPage, setCurrentPage] = useState(1);
    const cinemasPerPage = 5; // Number of cinemas per page
    const totalCinemas = cinemas.length;
    const totalPages = Math.ceil(totalCinemas / cinemasPerPage);

    // Get cinemas for the current page
    const currentCinemas = cinemas.slice((currentPage - 1) * cinemasPerPage, currentPage * cinemasPerPage);

    const handleDeleteCinema = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this cinema?")) {
            try {
                await instance.delete(`/cinema/${id}`);
                dispatch({ type: 'DELETE_CINEMA', payload: id });
                alert("Cinema deleted successfully!");
            } catch (err) {
                console.error("Failed to delete cinema:", err);
                alert("Failed to delete cinema");
            }
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="cinemas-dashboard">
            <h2>All Cinemas</h2>
            <div className="actions">
                <Link to={'/admin/cinemas/add'} className="add-cinema-btn">Add Cinema</Link>
            </div>
            <div className="table-container-cinemas">
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
                        {currentCinemas.map((cinema) => (
                            <tr key={cinema.id}>
                                <td>{cinema.id}</td>
                                <td>{cinema.cinema_name}</td>
                                <td>{cinema.phone}</td>
                                <td>{cinema.cinema_address}</td>
                                <td>{cinema.location_id}</td>
                                <td className="action-buttons">
                                    <Link to={`/admin/cinemas/edit/${cinema.id}`} className="edit-btn">✏️</Link>
                                    <button onClick={() => handleDeleteCinema(cinema.id!)} className="delete-btn">🗑</button>
                                </td>
                            </tr>
                        ))}
                        {currentCinemas.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>
                                    No cinemas available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="pagination">
                <button
                    className="prev-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="next-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CinemasDashboard;
