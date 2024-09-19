import React from 'react';
import './CategoriesDashboard.css';

const CategoriesDashboard = () => {
    const categories = [
        { id: 'CAT001', name: 'Action', description: 'Action-packed movies with thrilling scenes.' },
        { id: 'CAT002', name: 'Comedy', description: 'Light-hearted and humorous movies.' },
        { id: 'CAT003', name: 'Drama', description: 'Movies with intense character development and storylines.' },
    ];
    
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
                                <td>{category.name}</td>
                                <td>{category.description}</td>
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
