import React, { useEffect, useState } from 'react';

import './CategoriesDashboard.css';
import { Categories } from '../../../interface/Categories';
import instance from '../../../server';

const CategoriesDashboard = () => {
    const [categories, setCategories] = useState<Categories[]>([]);

    const fetchCategories = async () => {
        try {
            const response = await instance.get('/news_category');
            setCategories(response.data.data); // Đảm bảo response.data.data tồn tại
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="categories-dashboard">
            <h2>All Categories</h2>
            <div className="actions">
                <button className="add-category-btn">Add Category</button>
            </div>
            <div className="table-container">
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>Category ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.news_category_name}</td>
                                <td>{category.descriptions}</td>
                                <td className="action-buttons">
                                    <button className="view-btn">👁</button>
                                    <button className="edit-btn">✏️</button>
                                    <button className="delete-btn">🗑</button>
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
