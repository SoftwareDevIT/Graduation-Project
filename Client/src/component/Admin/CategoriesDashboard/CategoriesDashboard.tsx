import React, { useEffect, useState } from 'react';
import './CategoriesDashboard.css';

import { useCategoryContext } from '../../../Context/CategoriesContext';
import { Link } from 'react-router-dom';

const CategoriesDashboard = () => {
    const { state, deleteCategory } = useCategoryContext();
    const { categories } = state;

    return (
        <div className="categories-dashboard">
            <h2>All Movie Categories</h2>
            <div className="actions">
                <Link to={'/admin/categories/add'} className="add-category-btn">Add Movie Category</Link>
            </div>
            <div className="table-container">
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>Category ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.category_name}</td>
                                <td className="action-buttons">
                                    <button className="view-btn">👁</button>
                                    <Link to={`/admin/categories/edit/${category.id}`} className="edit-btn">✏️</Link>
                                    <button onClick={() => deleteCategory(category.id)} className="delete-btn">🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoriesDashboard;
