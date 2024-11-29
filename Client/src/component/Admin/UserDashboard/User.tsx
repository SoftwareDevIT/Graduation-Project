import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import instance from '../../../server';
import { User } from '../../../interface/User';

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
        return <p className="text-red-500 text-center mt-4">{error}</p>;
    }

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Link
                    to={'/admin/user/roles'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Quản lý vai trò
                </Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-1/4"
                />
            </div>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-600">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Tên Đăng Nhập</th>
                            <th className="px-4 py-2">Tên Đầy Đủ</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Ngày Tạo</th>
                            <th className="px-4 py-2">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user: User) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">{user.id}</td>
                                <td className="px-4 py-3">{user.user_name}</td>
                                <td className="px-4 py-3">{user.fullname}</td>
                                <td className="px-4 py-3">{user.email || 'Chưa có'}</td>
                                <td className="px-4 py-3">{new Date(user.created_at!).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <Link
                                        to={`/admin/user/edit/${user.id}`}
                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.439 19.274a4.5 4.5 0 01-1.691 1.074l-3.003 1.001 1.001-3.003a4.5 4.5 0 011.074-1.691L16.862 3.487z"
                                            />
                                        </svg>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center mt-6">
    <nav className="flex space-x-2">
        {/* Previous Page Button */}
        <button
            onClick={() => prevPageUrl && setCurrentPage(currentPage - 1)}
            disabled={!prevPageUrl}
            className={`px-4 py-2 rounded-lg border ${
                prevPageUrl
                    ? 'bg-gray-200 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
            Trước
        </button>

        {/* First Page */}
        {currentPage > 3 && (
            <>
                <button
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
                >
                    1
                </button>
                <span className="px-2 py-2 text-gray-500">...</span>
            </>
        )}

        {/* Display Current Page Range */}
        {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
            .filter((page) => page >= 1 && page <= totalPages)
            .map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg border ${
                        currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    {page}
                </button>
            ))}

        {/* Last Page */}
        {currentPage < totalPages - 2 && (
            <>
                <span className="px-2 py-2 text-gray-500">...</span>
                <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
                >
                    {totalPages}
                </button>
            </>
        )}

        {/* Next Page Button */}
        <button
            onClick={() => nextPageUrl && setCurrentPage(currentPage + 1)}
            disabled={!nextPageUrl}
            className={`px-4 py-2 rounded-lg border ${
                nextPageUrl
                    ? 'bg-gray-200 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
            Tiếp
        </button>
    </nav>
</div>

        </div>
    );
};

export default UserDashboard;
