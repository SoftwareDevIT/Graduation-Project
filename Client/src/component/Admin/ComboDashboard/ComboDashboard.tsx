import React, { useEffect } from 'react';
import './ComboDashboard.css';
import { Link } from 'react-router-dom';
import { useComboContext } from '../../../Context/ComboContext';
import instance from '../../../server';

const ComboDashboard: React.FC = () => {
    const { state, deleteCombo } = useComboContext(); 
    const { combos } = state; 
    const [loading, setLoading] = React.useState<boolean>(true); 
    const [error, setError] = React.useState<string | null>(null); 

    // Pagination states
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [combosPerPage] = React.useState<number>(5);

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

    const indexOfLastCombo = currentPage * combosPerPage; 
    const indexOfFirstCombo = indexOfLastCombo - combosPerPage; 
    const currentCombos = combos.slice(indexOfFirstCombo, indexOfLastCombo); 

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="combo-dashboard">
            <h2>All Combos</h2>
            <div className="actions">
                <Link to={'/admin/combo/add'} className="add-combo-btn">Add Combo</Link>
            </div>
            <div className="table-container-combo">
                <table className="combo-table">
                    <thead>
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
                                <td>{combo.descripton}</td>
                                <td>{combo.price}</td>
                                <td>{combo.volume}</td>
                                <td>{new Date(combo.created_at).toLocaleDateString()}</td>
                                <td className="action-buttons">
                                    <Link to={`/admin/combo/edit/${combo.id}`} className="edit-btn">✏️</Link>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDelete(combo.id)} 
                                    >
                                        🗑
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {/* Pagination Section */}
             <div className="pagination">
                    <button 
                        className="prev-btn" 
                        onClick={() => setCurrentPage(currentPage - 1)} 
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {Array.from({ length: Math.ceil(combos.length / combosPerPage) }, (_, index) => (
                        <button 
                            key={index + 1}
                            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => paginate(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button 
                        className="next-btn" 
                        onClick={() => setCurrentPage(currentPage + 1)} 
                        disabled={indexOfLastCombo >= combos.length}
                    >
                        Next
                    </button>
                </div>
        </div>
    );
};

export default ComboDashboard;
