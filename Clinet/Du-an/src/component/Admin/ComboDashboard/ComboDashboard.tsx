import React, { useEffect } from 'react';
import './ComboDashboard.css';

import { Link } from 'react-router-dom';
import instance from '../../../server';
import { useComboContext } from '../../../Context/ComboContext';

const ComboDashboard: React.FC = () => {
    const { state, deleteCombo } = useComboContext(); // Sử dụng useComboContext để lấy state và deleteCombo
    const { combos } = state; // Lấy combos từ state
    const [loading, setLoading] = React.useState<boolean>(true); // Biến loading để xử lý trạng thái tải
    const [error, setError] = React.useState<string | null>(null); // Biến error để xử lý lỗi

    // Fetch combos when the component mounts
    useEffect(() => {
        const fetchCombos = async () => {
            try {
                await instance.get('/combo'); // Lấy combos từ API
                setLoading(false);
            } catch (err) {
                setError('Failed to load combos');
                setLoading(false);
            }
        };

        fetchCombos();
    }, []);

    // Function to handle deleting a combo
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this combo?')) {
            try {
                await deleteCombo(id); // Sử dụng hàm deleteCombo từ context
                alert('Combo deleted successfully!');
            } catch (err) {
                setError('Failed to delete combo');
            }
        }
    };

    // Display loading and error states if applicable
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="combo-dashboard">
            <h2>All Combos</h2>
            <div className="actions">
                <Link to={'/admin/combo/add'} className="add-combo-btn">Add Combo</Link>
            </div>
            <div className="table-container">
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
                        {combos.map((combo) => (
                            <tr key={combo.id}>
                                <td>{combo.id}</td>
                                <td>{combo.combo_name}</td>
                                <td>{combo.descripton}</td>
                                <td>{combo.price}</td>
                                <td>{combo.volume}</td>
                            
                                <td>{new Date(combo.created_at).toLocaleDateString()}</td>
                                <td className="action-buttons">
                                    <button className="view-btn">👁</button>
                                    <Link to={`/admin/combo/edit/${combo.id}`} className="edit-btn">✏️</Link>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDelete(combo.id)} // Attach delete handler
                                    >
                                        🗑
                                    </button>
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
