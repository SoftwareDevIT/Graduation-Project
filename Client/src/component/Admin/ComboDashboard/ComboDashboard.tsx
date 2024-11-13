import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useComboContext } from '../../../Context/ComboContext';
import instance from '../../../server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';


const ComboDashboard: React.FC = () => {
    const { state, deleteCombo } = useComboContext();
    const { combos } = state;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [combosPerPage] = useState<number>(5);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                await instance.get('/combo');
                setLoading(false);
            } catch (err) {
                setError('Failed to load combos');
                setLoading(false);
            }
        };

        fetchCombos();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this combo?')) {
            try {
                await deleteCombo(id);
                alert('Combo deleted successfully!');
            } catch (err) {
                setError('Failed to delete combo');
            }
        }
    };

    const filteredCombos = combos.filter(combo =>
        combo.combo_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCombo = currentPage * combosPerPage;
    const indexOfFirstCombo = indexOfLastCombo - combosPerPage;
    const currentCombos = filteredCombos.slice(indexOfFirstCombo, indexOfLastCombo);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">All Combos</h2>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/combo/add'} className="btn btn-outline-primary">
                    Add Combo
                </Link>
                <input 
                    type="text" 
                    placeholder="Search by Combo Name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control w-25"
                />
            </div>
            <div className="table-responsive">
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="thead-light">
                        <tr>
                            <th>Combo ID</th>
                            <th>Combo Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Volume</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCombos.map((combo) => (
                            <tr key={combo.id}>
                                <td>{combo.id}</td>
                                <td>{combo.combo_name}</td>
                                <td>{combo.description}</td>
                                <td>{combo.price}</td>
                                <td>{combo.volume}</td>
                                <td>{new Date(combo.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div className="d-flex justify-content-around">
                                        <Link to={`/admin/combo/edit/${combo.id}`} className="btn btn-warning btn-sm">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Link>
                                        <button 
                                            className="btn btn-danger btn-sm" 
                                            onClick={() => handleDelete(combo.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                            Previous
                        </button>
                    </li>
                    {Array.from({ length: Math.ceil(filteredCombos.length / combosPerPage) }, (_, index) => (
                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${indexOfLastCombo >= filteredCombos.length ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ComboDashboard;
