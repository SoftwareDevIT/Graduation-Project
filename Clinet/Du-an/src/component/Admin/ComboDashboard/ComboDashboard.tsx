import React from 'react';
import './ComboDashboard.css';

const ComboDashboard = () => {
    const combos = [
        { id: 'COM001', name: 'Combo A', description: 'Description for Combo A' },
        { id: 'COM002', name: 'Combo B', description: 'Description for Combo B' },
        { id: 'COM003', name: 'Combo C', description: 'Description for Combo C' },
    ];

    return (
        <div className="combo-dashboard">
            <h2>All Combos</h2>
            <div className="actions">
                <button className="add-combo-btn">Add Combo</button>
            </div>
            <div className="table-container">
                <table className="combo-table">
                    <thead>
                        <tr>
                            <th>Combo ID</th>
                            <th>Combo Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {combos.map((combo) => (
                            <tr key={combo.id}>
                                <td>{combo.id}</td>
                                <td>{combo.name}</td>
                                <td>{combo.description}</td>
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

export default ComboDashboard;
