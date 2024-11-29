import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import instance from '../../../server';
import { Actor } from '../../../interface/Actor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ActorDashboard: React.FC = () => {
    const [actors, setActors] = useState<Actor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const actorsPerPage = 7;

    useEffect(() => {
        const fetchActors = async () => {
            try {
                const response = await instance.get('/actor');
                setActors(response.data.data);
                setTotalPages(Math.ceil(response.data.data.length / actorsPerPage));
            } catch (error) {
                setError('Không thể tải danh sách diễn viên');
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải danh sách diễn viên!',
                });
            }
        };

        fetchActors();
    }, []);

    const filteredActors = actors.filter((actor) =>
        actor.actor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const currentActors = filteredActors.slice(
        (currentPage - 1) * actorsPerPage,
        currentPage * actorsPerPage
    );

    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            // Hiển thị tất cả các trang nếu tổng số trang nhỏ hơn hoặc bằng 5
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Thêm trang đầu tiên
            pageNumbers.push(1);

            // Thêm dấu ba chấm nếu trang hiện tại lớn hơn 3
            if (currentPage > 3) pageNumbers.push('...');

            // Tạo các trang gần với trang hiện tại
            const start = Math.max(currentPage - 1, 2);
            const end = Math.min(currentPage + 1, totalPages - 1);
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }

            // Thêm dấu ba chấm nếu trang hiện tại nhỏ hơn tổng số trang trừ 2
            if (currentPage < totalPages - 2) pageNumbers.push('...');

            // Thêm trang cuối cùng
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Link
                    to={'/admin/actor/add'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                 <FontAwesomeIcon icon={faPlus} />   Thêm Diễn Viên
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
                            <th className="px-4 py-2">Ảnh</th>
                            <th className="px-4 py-2">Tên Diễn Viên</th>
                            <th className="px-4 py-2">Quốc Gia</th>
                            <th className="px-4 py-2">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentActors.length > 0 ? (
                            currentActors.map((actor) => (
                                <tr key={actor.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{actor.id}</td>
                                    <td className="px-4 py-3">
                                        <img
                                            src={actor.photo ?? undefined}
                                            alt={actor.actor_name}
                                            
                                            className="w-20 h-28 object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-3">{actor.actor_name}</td>
                                    <td className="px-4 py-3">{actor.country || 'Chưa xác định'}</td>
                                    <td className="px-4 py-3">
                                        <Link
                                            to={`/admin/actor/edit/${actor.id}`}
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4">
                                    Không có diễn viên nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center mt-6">
                <nav className="flex space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg border ${
                            currentPage > 1
                                ? 'bg-gray-200 hover:bg-gray-300'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Trước
                    </button>
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (typeof page === 'number') {
                                    handlePageChange(page);
                                }
                            }}
                            className={`px-4 py-2 rounded-lg border ${
                                currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg border ${
                            currentPage < totalPages
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

export default ActorDashboard;
