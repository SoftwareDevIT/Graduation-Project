import React, { useState } from 'react';
import './CategoriesDashboard.css';
import { useCategoryContext } from '../../../Context/CategoriesContext';
import { Link } from 'react-router-dom';

const CategoriesDashboard = () => {
    const { state, deleteCategory } = useCategoryContext();
    const { categories } = state;

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 3; // Number of categories per page
    const totalCategories = categories.length;
    const totalPages = Math.ceil(totalCategories / categoriesPerPage);

    // Get categories for the current page
    const currentCategories = categories.slice((currentPage - 1) * categoriesPerPage, currentPage * categoriesPerPage);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="categories-dashboard">
            <h2>All Movie Categories</h2>
            <div className="actions">
                <Link to={'/admin/categories/add'} className="add-category-btn">Add Movie Category</Link>
            </div>
            <div className="table-container-category">
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>Category ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.category_name}</td>
                                <td className="action-buttons">
                                   
                                    <Link to={`/admin/categories/edit/${category.id}`} className="edit-btn">✏️</Link>
                                    <button onClick={() => deleteCategory(category.id)} className="delete-btn">🗑</button>
                                </td>
                            </tr>
                        ))}
                        {currentCategories.length === 0 && (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'center' }}>
                                    No categories available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="pagination">
                <button
                    className="prev-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="next-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CategoriesDashboard;
