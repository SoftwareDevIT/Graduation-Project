import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { notification } from 'antd';
import instance from '../../../server';
import { PayMethod } from '../../../interface/PayMethod';

const PayMethodDashboard = () => {
    const [payMethods, setPayMethods] = useState<PayMethod[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const payMethodsPerPage = 7;

    useEffect(() => {
        const fetchPayMethods = async () => {
            try {
                const response = await instance.get('/method');
                setPayMethods(response.data.data);
            } catch (error) {
                console.error('Error fetching payment methods:', error);
                notification.error({
                    message: 'Error',
                    description: 'Unable to load payment methods!',
                    placement: 'topRight',
                });
            }
        };
        fetchPayMethods();
    }, []);

    const handleDelete = async (id: string) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa phương thức thanh toán này?');
        if (!isConfirmed) return;

        try {
            await instance.delete(`/method/${id}`);
            setPayMethods((prevMethods) => prevMethods.filter((method) => method.id !== id));
            notification.success({
                message: 'Thành công',
                description: 'Phương thức thanh toán đã được xóa!',
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Error deleting payment method:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể xóa phương thức thanh toán!',
                placement: 'topRight',
            });
        }
    };

    const filteredPayMethods = payMethods.filter(payMethod =>
        payMethod.pay_method_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPayMethods = filteredPayMethods.length;
    const totalPages = Math.ceil(totalPayMethods / payMethodsPerPage);
    const currentPayMethods = filteredPayMethods.slice(
        (currentPage - 1) * payMethodsPerPage,
        currentPage * payMethodsPerPage
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

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Link to={'/admin/method/add'} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <FontAwesomeIcon icon={faPlus} /> Thêm Phương Thức Thanh Toán
                </Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên phương thức"
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
                            <th className="px-4 py-2 text-center">Tên Phương Thức Thanh Toán</th>
                            <th className="px-4 py-2 text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPayMethods.map((payMethod) => (
                            <tr key={payMethod.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-center">{payMethod.id}</td>
                                <td className="px-4 py-3 text-center">{payMethod.pay_method_name}</td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center space-x-3">
                                        <Link
                                            to={`/admin/method/edit/${payMethod.id}`}
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
                                            onClick={() => handleDelete(payMethod.id)}
                                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
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

export default PayMethodDashboard;
