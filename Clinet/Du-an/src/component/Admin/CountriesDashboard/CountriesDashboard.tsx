import React, { useEffect, useState } from 'react';

import './CountriesDashboard.css';
import instance from '../../../server';
import { Location } from '../../../interface/Location';

const CountriesDashboard = () => {
    const [countries, setCountries] = useState<Location[]>([]);

    const fetchCountries = async () => {
        try {
            const response = await instance.get('/location');
            setCountries(response.data.data); // Đảm bảo response.data.data tồn tại
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

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
                                <td>{country.location_name}</td>
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
