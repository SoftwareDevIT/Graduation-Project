import React from 'react';
import './TicketsDashboard.css';

const TicketsDashboard = () => {
    const tickets = [
        { id: 'TKT001', movie: 'Inception', showtime: '2024-09-20 18:30', seat: 'A5', price: 12, status: 'Booked' },
        { id: 'TKT002', movie: 'Avengers: Endgame', showtime: '2024-09-21 20:00', seat: 'B3', price: 15, status: 'Cancelled' },
        { id: 'TKT003', movie: 'Interstellar', showtime: '2024-09-22 17:00', seat: 'C2', price: 10, status: 'Booked' },
    ];

    return (
        <div className="tickets-management">
            <h2>Ticket Management</h2>
            <div className="actions">
                <button className="add-ticket-btn">Add New Ticket</button>
            </div>
            <div className="table-container-ticket">
                <table className="ticket-table">
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Movie Name</th>
                            <th>Showtime</th>
                            <th>Seat</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>{ticket.id}</td>
                                <td>{ticket.movie}</td>
                                <td>{ticket.showtime}</td>
                                <td>{ticket.seat}</td>
                                <td>${ticket.price}</td>
                                <td>{ticket.status}</td>
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

export default TicketsDashboard;
