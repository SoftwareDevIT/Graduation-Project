import React, { useState } from 'react';
import './CountriesDashboard.css';
import { useCountryContext } from '../../../Context/CountriesContext';
import { Link } from 'react-router-dom';

const CountriesDashboard: React.FC = () => {
    const { state, deleteCountry } = useCountryContext();
    const { countries } = state;

    const [currentPage, setCurrentPage] = useState(1);
    const countriesPerPage = 11; // Number of countries per page
    const totalCountries = countries.length;
    const totalPages = Math.ceil(totalCountries / countriesPerPage);

    // Get countries for the current page
    const currentCountries = countries.slice((currentPage - 1) * countriesPerPage, currentPage * countriesPerPage);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this country?");
        if (confirmDelete) {
            await deleteCountry(id);
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="countries-dashboard">
            <h2>All Countries</h2>
            <div className="actions">
                <Link to={'/admin/countries/add'} className="add-country-btn">Add Country</Link>
            </div>
            <div className="table-container-country">
                <table className="country-table">
                    <thead>
                        <tr>
                            <th>Country ID</th>
                            <th>Country Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCountries.map((country) => (
                            <tr key={country.id}>
                                <td>{country.id}</td>
                                <td>{country.location_name}</td>
                                <td className="action-buttons">
                                    <button onClick={() => handleDelete(country.id)} className="delete-btn">🗑</button>
                                </td>
                            </tr>
                        ))}
                        {currentCountries.length === 0 && (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'center' }}>
                                    No countries available.
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

export default CountriesDashboard;
