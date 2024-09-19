import React from 'react';
import './User.css';

const UserDashboard = () => {
    const users = [
        { id: 'USR001', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', reviews: 55, rating: 4.5 },
        { id: 'USR002', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', reviews: 143, rating: 4.1 },
        { id: 'USR003', name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'User', reviews: 174, rating: 4.4 },
    ];

    return (
        <div className="user-management">
            <h2>All Users List</h2>
            <div className="actions">
                <button className="add-user-btn">Add User</button>
            </div>
            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <div className="rating">
                                        <span className="star">⭐</span> {user.rating}
                                        <span className="reviews"> ({user.reviews} Reviews)</span>
                                    </div>
                                </td>
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

export default UserDashboard;
