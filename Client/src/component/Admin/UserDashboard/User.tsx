import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import instance from '../../../server';
import { User } from '../../../interface/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const UserDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [usersPerPage] = useState<number>(3);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await instance.get('/all-user');
                setUsers(response.data);
            } catch (err) {
                setError('Lỗi khi tải người dùng');
            }
        };

        fetchUsers();
    }, []);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const filteredUsers = users.filter(user =>
        user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    if (error) {
        return <p>{error}</p>;
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">Quản Lý Người Dùng</h2>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/user/roles'} className="btn btn-outline-primary">
                    Quản lý vai trò
                </Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control w-25"  
                />
            </div>
            <div className="table-responsive">
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="thead-light">
                        <tr>
                            <th>ID</th>
                            <th>Tên Đăng Nhập</th>
                            <th>Tên Đầy Đủ</th>
                            <th>Email</th>
                            <th>Ngày Tạo</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user: User) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.user_name}</td>
                                <td>{user.fullname}</td>
                                <td>{user.email || 'Chưa có'}</td>
                                <td>{new Date(user.created_at!).toLocaleDateString()}</td>
                                <td>    
                                    <div className="d-flex justify-content-around">
                                        <Link to={`/admin/user/edit/${user.id}`} className="btn btn-warning btn-sm mr-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <nav className="d-flex justify-content-center mt-4">
    <ul className="pagination">
        {/* Nút Trước */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                Trước
            </button>
        </li>

        {/* Hiển thị các trang */}
        {(() => {
            const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
            const maxPagesToShow = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            const pages = [];
            if (startPage > 1) {
                pages.push(
                    <li key={1} className="page-item">
                        <button className="page-link" onClick={() => paginate(1)}>
                            1
                        </button>
                    </li>
                );
                if (startPage > 2) {
                    pages.push(
                        <li key="start-ellipsis" className="page-item disabled">
                            <span className="page-link">...</span>
                        </li>
                    );
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => paginate(i)}>
                            {i}
                        </button>
                    </li>
                );
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push(
                        <li key="end-ellipsis" className="page-item disabled">
                            <span className="page-link">...</span>
                        </li>
                    );
                }
                pages.push(
                    <li key={totalPages} className="page-item">
                        <button className="page-link" onClick={() => paginate(totalPages)}>
                            {totalPages}
                        </button>
                    </li>
                );
            }

            return pages;
        })()}

        {/* Nút Tiếp */}
        <li
            className={`page-item ${
                indexOfLastUser >= filteredUsers.length ? 'disabled' : ''
            }`}
        >
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                Tiếp
            </button>
        </li>
    </ul>
</nav>

        </div>
    );
};

export default UserDashboard;
