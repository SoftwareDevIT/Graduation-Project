import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { notification } from 'antd'; // Import the notification component
import 'bootstrap/dist/css/bootstrap.min.css';
import { PayMethod } from '../../../interface/PayMethod';
import instance from '../../../server';

const PayMethodDashboard = () => {
    const [payMethods, setPayMethods] = useState<PayMethod[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    const payMethodsPerPage = 7;

    useEffect(() => {
        // Fetch API to get the list of payment methods
        const fetchPayMethods = async () => {
            try {
                const response = await instance.get('/method'); // Update the endpoint
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
        // Confirm the delete action
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa phương thức thanh toán này?');
        if (!isConfirmed) return;

        try {
            await instance.delete(`/method/${id}`); // Gọi API xóa phương thức thanh toán
            setPayMethods((prevMethods) => prevMethods.filter((method) => method.id !== id)); // Cập nhật lại danh sách
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
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/method/add'} className="btn btn-outline-primary">
                    <FontAwesomeIcon icon={faPlus} /> Thêm Phương Thức Thanh Toán
                </Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên phương thức"
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
                            <th>Tên Phương Thức Thanh Toán</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPayMethods.map((payMethod) => (
                            <tr key={payMethod.id}>
                                <td>{payMethod.id}</td>
                                <td>{payMethod.pay_method_name}</td>
                                <td>
                                    <div className="d-flex justify-content-around">
                                        <Link to={`/admin/method/edit/${payMethod.id}`} className="btn btn-warning btn-sm">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(payMethod.id)} // Thêm hàm xóa vào đây
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {currentPayMethods.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center">
                                    Không có phương thức thanh toán nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                            Trước
                        </button>
                    </li>
                    {getPageNumbers().map((page, index) => (
                        <li key={index} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                            {page === '...' ? (
                                <span className="page-link">...</span>
                            ) : (
                                <button className="page-link" onClick={() => handlePageChange(Number(page))}>
                                    {page}
                                </button>
                            )}
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                            Tiếp
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default PayMethodDashboard;
