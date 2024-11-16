import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useComboContext } from '../../../Context/ComboContext';
import instance from '../../../server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ComboDashboard: React.FC = () => {
    const { state, deleteCombo } = useComboContext();
    const { combos } = state;
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [combosPerPage] = useState<number>(5);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                await instance.get('/combo');
            } catch (err) {
                setError('Không thể tải các combo');
            }
        };

        fetchCombos();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa combo này?')) {
            try {
                await deleteCombo(id);
                alert('Combo đã được xóa thành công!');
            } catch (err) {
                setError('Không thể xóa combo');
            }
        }
    };

    const filteredCombos = combos.filter(combo =>
        combo.combo_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCombo = currentPage * combosPerPage;
    const indexOfFirstCombo = indexOfLastCombo - combosPerPage;
    const currentCombos = filteredCombos.slice(indexOfFirstCombo, indexOfLastCombo);

    if (error) {
        return <p>{error}</p>;
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">Tất Cả Các Combo</h2>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/combo/add'} className="btn btn-outline-primary">
                    Thêm Combo
                </Link>
                <input 
                    type="text" 
                    placeholder="Tìm kiếm theo tên combo..." 
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
                            <th>Tên Combo</th>
                            <th>Mô Tả</th>
                            <th>Giá</th>
                            <th>Khối Lượng</th>
                            <th>Ngày Tạo</th>
                            <th>Thao Tác</th>
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
                            Trước
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
                            Tiếp Theo
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ComboDashboard;
