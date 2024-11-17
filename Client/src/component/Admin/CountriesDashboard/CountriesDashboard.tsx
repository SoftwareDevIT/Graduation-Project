import React, { useState } from 'react';
import { useCountryContext } from '../../../Context/CountriesContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CountriesDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const CountriesDashboard: React.FC = () => {
    const { state, deleteCountry } = useCountryContext();
    const { countries } = state;

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const countriesPerPage = 11; // Number of countries per page

    // Filter countries based on the search term
    const filteredCountries = countries.filter(country =>
        country.location_name &&
        country.location_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCountries = filteredCountries.length;
    const totalPages = Math.ceil(totalCountries / countriesPerPage);

    // Get countries for the current page
    const currentCountries = filteredCountries.slice(
        (currentPage - 1) * countriesPerPage,
        currentPage * countriesPerPage
    );

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this country?");
        if (confirmDelete) {
            await deleteCountry(id);
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => setCurrentPage(page);

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">All Countries</h2>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/countries/add'} className="btn btn-outline-primary">
                    Add Country
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
                                <td>
                                    <button 
                                        onClick={() => handleDelete(country.id)} 
                                        className="btn btn-danger btn-sm"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {currentCountries.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center">
                                    No countries available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
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

export default CountriesDashboard;
