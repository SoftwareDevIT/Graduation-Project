import React, { useEffect, useState } from 'react';
import './ComboDashboard.css';
import { Combo } from '../../../interface/Combo';
import instance from '../../../server';
import ReactPaginate from 'react-paginate';

const ComboDashboard: React.FC = () => {
    const [combos, setCombos] = useState<Combo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 1; // Số lượng combo trên mỗi trang
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                const response = await instance.get('/combo');
                setCombos(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải combos');
                setLoading(false);
            }
        };

        fetchCombos();
    }, []);

    const pageCount = Math.ceil(combos.length / itemsPerPage);
    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const currentCombos = combos.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="combo-dashboard">
            <h2>Tất cả các Combo</h2>
            <div className="actions">
                <button className="add-combo-btn">Thêm Combo</button>
            </div>
            <div className="table-container">
                <table className="combo-table">
                    <thead>
                        <tr>
                            <th>ID Combo</th>
                            <th>Tên Combo</th>
                            <th>Mô Tả</th>
                            <th>Giá</th>
                            <th>Khối Lượng</th>
                            <th>Trạng Thái</th>
                            <th>Ngày Tạo</th>
                            <th>Hành Động</th>
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
                                <td>{combo.status}</td>
                                <td>{new Date(combo.created_at).toLocaleDateString()}</td>
                                <td className="action-buttons">
                                    <button className="view-btn">👁</button>
                                    <button className="edit-btn">✏️</button>
                                    <button className="delete-btn">🗑</button>
                                </td>
                            </tr>
                        ))}
                        {currentCombos.length === 0 && (
                            <tr>
                                <td colSpan={8}>Không có combo nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <ReactPaginate
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    activeClassName={"active"}
                />
            </div>
        </div>
    );
};

export default ComboDashboard;
