import { User } from '../../../interface/User';
import instance from '../../../server';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { useEffect, useState } from 'react';

const UserDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 2; // Number of users per page
    const [currentPage, setCurrentPage] = useState(0);

    // Calculate total pages
    const pageCount = Math.ceil(users.length / itemsPerPage);

    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const currentUsers = users.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    // Fetch users from the API when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {

                const response = await instance.get('/lists');

                console.log('API Response:', response);  // Log the full response object
                console.log('Data:', response.data.data);      // Log the data part specifically
                setUsers(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err); // Log the error
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="user-management">

            <div className="table-container">
                <div className="table-header">
                    <h3>All Users List</h3>
                    <div className="add-user-container">

                     <Link to={'/admin/user/add'}>   <button className="add-user-btn">Add User</button></Link>

                     <Link to={'/admin/user/add'}><button className="add-user-btn">Add User</button></Link>

                    </div>
                </div>

                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(currentUsers) && currentUsers.length > 0 ? (
                            currentUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.fullname}</td>
                                    <td>{user.email || 'N/A'}</td>
                                    <td>{user.role_id}</td>
                                    <td>{user.phone}</td>

                                    <td className="action-buttons">
                                        <button className="view-btn">👁</button>
                                        <button className="edit-btn">✏️</button>
                                        <button className="delete-btn">🗑</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>No users available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <ReactPaginate
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={4} // Number of page buttons to display
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