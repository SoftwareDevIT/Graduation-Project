import React, { useState } from 'react';
import { useCountryContext } from '../../../Context/CountriesContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { notification } from 'antd';  // Import the notification component
import './CountriesDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const CountriesDashboard: React.FC = () => {
    const { state, deleteCountry } = useCountryContext();
    const { countries } = state;

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const countriesPerPage = 7; // Number of countries per page

    // Filter countries based on the search term
    const filteredCountries = countries.filter(country =>
        country.location_name &&
        country.location_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCountries = filteredCountries.length;
    const totalPages = Math.ceil(totalCountries / countriesPerPage);

    // Get the countries for the current page
    const currentCountries = filteredCountries.slice(
        (currentPage - 1) * countriesPerPage,
        currentPage * countriesPerPage
    );

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa quốc gia này?");
        if (confirmDelete) {
            await deleteCountry(id);
            // Show success notification after deletion
            notification.success({
                message: 'Xóa thành công',
                description: 'Quốc gia đã được xóa thành công.',
                placement: 'topRight',
            });
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Determine the page range to display
    const pageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= maxVisiblePages; i++) {
                    pages.push(i);
                }
                pages.push('...');
            } else if (currentPage >= totalPages - 2) {
                pages.unshift('...');
                for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.unshift('...');
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i);
                }
                pages.push('...');
            }
        }

        return pages;
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/countries/add'} className="btn btn-outline-primary">
                <FontAwesomeIcon icon={faPlus} /> Thêm Khu Vực
                </Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control w-25"
                />
            </div>
            <div className="table-responsive">
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="thead-light">
                        <tr>
                            <th>ID</th>
                            <th>Tên Khu Vực</th>
                            <th>Thao Tác</th>
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
                                    Không có khu vực nào.
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
                            Trước
                        </button>
                    </li>
                    {pageNumbers().map((number, index) => (
                        <li key={index} className={`page-item ${typeof number === 'number' && currentPage === number ? 'active' : ''} ${number === '...' ? 'disabled' : ''}`}>
                            {number === '...' ? (
                                <span className="page-link">...</span>
                            ) : (
                                <button className="page-link" onClick={() => handlePageChange(number as number)}>
                                    {number}
                                </button>
                            )}
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                            Tiếp
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default CountriesDashboard;
