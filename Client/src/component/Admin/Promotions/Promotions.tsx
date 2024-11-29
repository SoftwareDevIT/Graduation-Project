import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { notification } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Promotions } from '../../../interface/Promotions';
import instance from '../../../server';

const PromotionsDashboard = () => {
    const [promotions, setPromotions] = useState<Promotions[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');  
    const promotionsPerPage = 7;

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await instance.get('/promotions');
                setPromotions(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu khuyến mãi:', error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải danh sách khuyến mãi!',
                    placement: 'topRight',
                });
            }
        };
        fetchPromotions();
    }, []);

    const filteredPromotions = promotions.filter(promotion =>
        promotion.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPromotions = filteredPromotions.length;
    const totalPages = Math.ceil(totalPromotions / promotionsPerPage);
    const currentPromotions = filteredPromotions.slice(
        (currentPage - 1) * promotionsPerPage,
        currentPage * promotionsPerPage
    );

    const handlePageChange = (page: number) => setCurrentPage(page);

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

    const deletePromotion = (id: number) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?');
        
        if (isConfirmed) {
            try {
                instance.delete(`/promotions/${id}`).then(() => {
                    setPromotions(promotions.filter(promotion => promotion.id !== id));
                    notification.success({
                        message: 'Thành công',
                        description: 'Khuyến mãi đã được xóa.',
                        placement: 'topRight',
                    });
                });
            } catch (error) {
                console.error('Lỗi khi xóa khuyến mãi:', error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể xóa khuyến mãi!',
                    placement: 'topRight',
                });
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Link to={'/admin/promotions/add'} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    <FontAwesomeIcon icon={faPlus} /> Thêm Khuyến Mãi
                </Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã khuyến mãi"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-1/4"
                />
            </div>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-600">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-center">ID</th>
                            <th className="px-4 py-2 text-center">Mã Khuyến Mãi</th>
                            <th className="px-4 py-2 text-center">Giảm Giá (%)</th>
                            <th className="px-4 py-2 text-center">Giảm Tối Đa</th>
                            <th className="px-4 py-2 text-center">Hóa Đơn Tối Thiểu</th>
                            <th className="px-4 py-2 text-center">Thời Gian Áp Dụng</th>
                            <th className="px-4 py-2 text-center">Thời Gian Hết Hạn</th>
                            <th className="px-4 py-2 text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPromotions.map((promotion) => (
                            <tr key={promotion.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-center">{promotion.id}</td>
                                <td className="px-4 py-3 text-center">{promotion.code}</td>
                                <td className="px-4 py-3 text-center">{promotion.discount_percentage}%</td>
                                <td className="px-4 py-3 text-center">{promotion.max_discount}</td>
                                <td className="px-4 py-3 text-center">{promotion.min_purchase}</td>
                                <td className="px-4 py-3 text-center">{promotion.valid_from}</td>
                                <td className="px-4 py-3 text-center">{promotion.valid_to}</td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center space-x-3">
                                        <Link
                                            to={`/admin/promotions/edit/${promotion.id}`}
                                            className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center hover:bg-yellow-200 transition"
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
                                        <button
                                            onClick={() => deletePromotion(promotion.id)}
                                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {currentPromotions.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    Không có khuyến mãi nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center mt-6">
                <nav className="flex space-x-2">
                    <button
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
                    >
                        Trước
                    </button>
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(Number(page))}
                            className={`px-4 py-2 rounded-lg border ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
                    >
                        Tiếp
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default PromotionsDashboard;
