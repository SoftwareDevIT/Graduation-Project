import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import instance from '../../../server';
import { User } from '../../../interface/User';
import './User.css'

const UserDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [usersPerPage] = useState<number>(3);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await instance.get('/all-user');
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await instance.delete(`/all-user/${id}`);
                setUsers(users.filter(user => user.id !== id));
                alert('User deleted successfully!');
            } catch (err) {
                setError('Failed to delete user');
            }
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="user-dashboard">
            <h2>All Users</h2>
            <div className="actions">
                <Link to={'/admin/user/add'} className="add-user-btn">Add User</Link>
            </div>
            <div className="table-pagination-container">
                <div className="table-container2">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Username</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Role ID</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user: User) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.user_name}</td>
                                    <td>{user.fullname}</td>
                                    <td>{user.email || 'N/A'}</td>
                                    <td>{user.role_id}</td>
                                    <td>{new Date(user.created_at!).toLocaleDateString()}</td>
                                    <td className="action-buttons">
                                        <Link to={`/admin/user/edit/${user.id}`} className="edit-btn">✏️</Link>
                                        <button 
                                            className="delete-btn" 
                                            onClick={() => handleDelete(user.id)} 
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
            <div className="pagination">
                <button 
                    className="prev-btn" 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
                    <button 
                        key={index + 1}
                        className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button 
                    className="next-btn" 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={indexOfLastUser >= users.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
