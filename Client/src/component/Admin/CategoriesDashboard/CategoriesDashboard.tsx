import React, { useState } from 'react';
import { useCategoryContext } from '../../../Context/CategoriesContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { notification } from 'antd'; // Import the notification component
import 'bootstrap/dist/css/bootstrap.min.css';

const CategoriesDashboard = () => {
    const { state, deleteCategory } = useCategoryContext();
    const { categories } = state;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const categoriesPerPage = 7;

    const filteredCategories = categories.filter(category => 
        category.category_name && 
        category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const totalCategories = filteredCategories.length;
    const totalPages = Math.ceil(totalCategories / categoriesPerPage);
    const currentCategories = filteredCategories.slice(
        (currentPage - 1) * categoriesPerPage,
        currentPage * categoriesPerPage
    );
    
    const handleDelete = (id: number) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa thể loại này?');
        if (confirmDelete) {
            deleteCategory(id);
            // Show success notification after deleting
            notification.success({
                message: 'Thành Công',
                description: 'Thể loại đã được xóa thành công!',
                placement: 'topRight',
            });
        }
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            // If there are 5 or fewer pages, show them all
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // If there are more than 5 pages, display the first 2, last 2, and the current page with ellipses in between
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
                <Link to={'/admin/categories/add'} className="btn btn-outline-primary">
                <FontAwesomeIcon icon={faPlus} /> Thêm Thể Loại Phim
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
                            <th>Tên Thể Loại</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.category_name}</td>
                                <td>
                                    <div className="d-flex justify-content-around">
                                        <Link to={`/admin/categories/edit/${category.id}`} className="btn btn-warning btn-sm">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                        <button
                                               onClick={() => handleDelete(category.id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {currentCategories.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center">
                                    Không có thể loại nào.
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

export default CategoriesDashboard;
