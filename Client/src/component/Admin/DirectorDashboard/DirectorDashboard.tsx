import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import instance from '../../../server';
import { Director } from '../../../interface/Director';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const DirectorDashboard = () => {
    const [directors, setDirectors] = useState<Director[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const directorsPerPage = 7;

    useEffect(() => {
        const fetchDirectors = async () => {
            try {
                const response = await instance.get('/director');
                setDirectors(response.data.data);
                setTotalPages(Math.ceil(response.data.data.length / directorsPerPage));
            } catch (error) {
                setError('Không thể tải danh sách đạo diễn');
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải danh sách đạo diễn!',
                });
            }
        };

        fetchDirectors();
    }, []);

    const filteredDirectors = directors.filter((director) =>
        director.director_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const currentDirectors = filteredDirectors.slice(
        (currentPage - 1) * directorsPerPage,
        currentPage * directorsPerPage
    );

    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            if (currentPage > 3) pageNumbers.push('...');
            const start = Math.max(currentPage - 1, 2);
            const end = Math.min(currentPage + 1, totalPages - 1);
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }
            if (currentPage < totalPages - 2) pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Link
                    to={'/admin/director/add'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                   <FontAwesomeIcon icon={faPlus} /> Thêm Đạo Diễn
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
                            <th className="px-4 py-2">Tên Đạo Diễn</th>
                            <th className="px-4 py-2">Quốc Gia</th>
                            <th className="px-4 py-2">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDirectors.length > 0 ? (
                            currentDirectors.map((director) => (
                                <tr key={director.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{director.id}</td>
                                    <td className="px-4 py-3">
                                        <img
                                            src={director.photo ?? undefined}
                                            alt={director.director_name}
                                            className="w-20 h-28 object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-3">{director.director_name}</td>
                                    <td className="px-4 py-3">{director.country || 'Chưa xác định'}</td>
                                    <td className="px-4 py-3">
                                        <Link
                                            to={`/admin/director/edit/${director.id}`}
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
                                    Không có đạo diễn nào.
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

export default DirectorDashboard;
