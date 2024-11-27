import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { notification } from 'antd'; // Import the notification component
import 'bootstrap/dist/css/bootstrap.min.css';
import { Promotions } from '../../../interface/Promotions'; // Import the Promotions interface
import instance from '../../../server';

const PromotionsDashboard = () => {
    const [promotions, setPromotions] = useState<Promotions[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');  
    const promotionsPerPage = 7;

    useEffect(() => {
        // Gọi API để lấy danh sách khuyến mãi
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

    // Function to handle deletion of a promotion with window.confirm
    const deletePromotion = (id: number) => {
        // Use window.confirm to ask the user if they are sure
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?');
        
        if (isConfirmed) {
            try {
                // Make DELETE request to API
                instance.delete(`/promotions/${id}`).then(() => {
                    // Remove the deleted promotion from the state
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
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/promotions/add'} className="btn btn-outline-primary">
                    <FontAwesomeIcon icon={faPlus} /> Thêm Khuyến Mãi
                </Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã khuyến mãi"
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
                            <th>Mã Khuyến Mãi</th>
                            <th>Giảm Giá (%)</th>
                            <th>Giảm Tối Đa</th>
                            <th>Hóa Đơn Tối Thiểu</th>
                            <th>Thời Gian Áp Dụng</th>
                            <th>Thời Gian Hết Hạn</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPromotions.map((promotion) => (
                            <tr key={promotion.id}>
                                <td>{promotion.id}</td>
                                <td>{promotion.code}</td>
                                <td>{promotion.discount_percentage}%</td>
                                <td>{promotion.max_discount}</td>
                                <td>{promotion.min_purchase}</td>
                                <td>{promotion.valid_from}</td>
                                <td>{promotion.valid_to}</td>
                                <td>
                                    <div className="d-flex justify-content-around">
                                        <Link to={`/admin/promotions/edit/${promotion.id}`} className="btn btn-warning btn-sm">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deletePromotion(promotion.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {currentPromotions.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center">
                                    Không có khuyến mãi nào.
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

export default PromotionsDashboard;
