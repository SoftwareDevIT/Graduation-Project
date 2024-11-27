import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import instance from '../../../server';
import { User } from '../../../interface/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const UserDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await instance.get(`/all-user?page=${currentPage}`);
                setUsers(response.data.data);
                setTotalPages(response.data.last_page);
                setNextPageUrl(response.data.next_page_url);
                setPrevPageUrl(response.data.prev_page_url);
            } catch (err) {
                setError('Lỗi khi tải người dùng');
            }
        };

        fetchUsers();
    }, [currentPage]);

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) {
        return <p>{error}</p>;
    }

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="container mt-5">
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
                        {filteredUsers.map((user: User) => (
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
        {/* Previous Page Button */}
        <li className={`page-item ${!prevPageUrl ? 'disabled' : ''}`}>
            <button
                className="page-link"
                onClick={() => prevPageUrl && setCurrentPage(currentPage - 1)}
                disabled={!prevPageUrl}
            >
                Trước
            </button>
        </li>

        {/* Page Numbers */}
        {totalPages > 5 && currentPage > 3 && (
            <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(1)}>
                    1
                </button>
            </li>
        )}
        
        {totalPages > 5 && currentPage > 4 && (
            <li className="page-item disabled">
                <span className="page-link">...</span>
            </li>
        )}

        {[...Array(5)].map((_, index) => {
            const pageNumber = currentPage - 2 + index;
            if (pageNumber >= 1 && pageNumber <= totalPages) {
                return (
                    <li
                        key={pageNumber}
                        className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                        <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                            {pageNumber}
                        </button>
                    </li>
                );
            }
            return null;
        })}

        {totalPages > 5 && currentPage < totalPages - 3 && (
            <li className="page-item disabled">
                <span className="page-link">...</span>
            </li>
        )}

        {totalPages > 5 && currentPage < totalPages - 2 && (
            <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </button>
            </li>
        )}

        {/* Next Page Button */}
        <li className={`page-item ${!nextPageUrl ? 'disabled' : ''}`}>
            <button
                className="page-link"
                onClick={() => nextPageUrl && setCurrentPage(currentPage + 1)}
                disabled={!nextPageUrl}
            >
                Tiếp
            </button>
        </li>
    </ul>
</nav>

        </div>
    );
};

export default UserDashboard;
