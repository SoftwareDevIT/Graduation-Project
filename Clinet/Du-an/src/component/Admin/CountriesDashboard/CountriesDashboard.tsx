import React from 'react';
import './CountriesDashboard.css';

const CountriesDashboard = () => {
    const countries = [
        { id: 'COU001', name: 'United States' },
        { id: 'COU002', name: 'Canada' },
        { id: 'COU003', name: 'France' },
    ];

    return (
        <div className="countries-dashboard">
            <h2>All Countries</h2>
            <div className="actions">
                <button className="add-country-btn">Add Country</button>
            </div>
            <div className="table-container">
                <table className="country-table">
                    <thead>
                        <tr>
                            <th>Country ID</th>
                            <th>Country Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {countries.map((country) => (
                            <tr key={country.id}>
                                <td>{country.id}</td>
                                <td>{country.name}</td>
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

export default CountriesDashboard;
