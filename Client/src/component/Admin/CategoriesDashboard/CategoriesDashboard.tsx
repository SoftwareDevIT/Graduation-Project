import React, { useState } from 'react';
import { useCategoryContext } from '../../../Context/CategoriesContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const CategoriesDashboard = () => {
    const { state, deleteCategory } = useCategoryContext();
    const { categories} = state;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const categoriesPerPage = 3;

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

    const handlePageChange = (page: number) => setCurrentPage(page);

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">All Movie Categories</h2>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/categories/add'} className="btn btn-outline-primary">
                    Add Movie Category
                </Link>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control w-25"
                />
            </div>
            <div className="table-responsive">
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="thead-light">
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
                                <td>
                                    <div className="d-flex justify-content-around">
                                        <Link to={`/admin/categories/edit/${category.id}`} className="btn btn-warning btn-sm">
                                        <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                        <button
                                            onClick={() => deleteCategory(category.id)}
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
                                    No categories available.
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
                            Prev
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default CategoriesDashboard;
