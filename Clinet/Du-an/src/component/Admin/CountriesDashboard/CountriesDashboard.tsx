import React from 'react';
import './CountriesDashboard.css';
import { useCountryContext } from '../../../Context/CountriesContext';
import { Location } from '../../../interface/Location';
import { Link } from 'react-router-dom';

const CountriesDashboard: React.FC = () => {
    const { state, deleteCountry } = useCountryContext();
    const { countries } = state;

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this country?");
        if (confirmDelete) {
            await deleteCountry(id);
        }
    };

    return (
        <div className="countries-dashboard">
            <h2>All Countries</h2>
            <div className="actions">
                <Link to={'/admin/countries/add'} className="add-country-btn">Add Country</Link>
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
                                    <Link to={`/admin/countries/edit/${country.id}`} className="edit-btn">✏️</Link>
                                    <button onClick={() => handleDelete(country.id)} className="delete-btn">🗑</button>
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
