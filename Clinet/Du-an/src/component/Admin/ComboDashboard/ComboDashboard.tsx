import React, { useEffect, useState } from 'react';
import './ComboDashboard.css';
import { Combo } from '../../../interface/Combo';
import instance from '../../../server';


const ComboDashboard: React.FC = () => {
    const [combos, setCombos] = useState<Combo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch combos using the Axios instance
    useEffect(() => {
        const fetchCombos = async () => {
            try {
                const response = await instance.get('/combo'); // Sử dụng instance để gọi API
                setCombos(response.data.data); // Giả sử response.data chứa mảng combo
                setLoading(false);
            } catch (err) {
                setError('Failed to load combos');
                setLoading(false);
            }
        };

        fetchCombos();
    }, []);

    // Hiển thị trạng thái loading và error nếu có
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
                <button className="add-combo-btn">Add Combo</button>
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
                            <th>Status</th>
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
                                <td>{combo.status}</td>
                                <td>{new Date(combo.created_at).toLocaleDateString()}</td>
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
