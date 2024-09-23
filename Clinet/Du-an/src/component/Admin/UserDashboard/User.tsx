import React, { useState } from 'react';
import './User.css';
import ReactPaginate from 'react-paginate';

const UserDashboard = () => {
    const users = [
        { id: 'USR001', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', reviews: 55, rating: 4.5 },
        { id: 'USR002', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', reviews: 143, rating: 4.1 },
        { id: 'USR003', name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'User', reviews: 174, rating: 4.4 },
        { id: 'USR003', name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'User', reviews: 174, rating: 4.4 },
        { id: 'USR003', name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'User', reviews: 174, rating: 4.4 },
        { id: 'USR003', name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'User', reviews: 174, rating: 4.4 },
        { id: 'USR003', name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'User', reviews: 174, rating: 4.4 },
        { id: 'USR003', name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'User', reviews: 174, rating: 4.4 },
        { id: 'USR003', name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'User', reviews: 174, rating: 4.4 },
        { id: 'USR003', name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'User', reviews: 174, rating: 4.4 },
    ];
    const itemsPerPage = 3; // Số lượng người dùng mỗi trang
    const [currentPage, setCurrentPage] = useState(0);
    
    // Tính toán số trang
    const pageCount = Math.ceil(users.length / itemsPerPage);

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const currentUsers = users.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    return (
        <div className="user-management">
           
           <div className="table-container">
           <div className="table-header">
    <h3>All Users List</h3>
    <div className="add-user-container">
        <button className="add-user-btn">Add User</button>
    </div>
</div>

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
            {currentUsers.map(user => (
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
    <ReactPaginate
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={4} // Số ô trang hiển thị
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

export default UserDashboard;
