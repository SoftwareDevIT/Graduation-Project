import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useComboContext } from '../../../Context/ComboContext';
import instance from '../../../server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { notification } from 'antd'; // Import notification from Ant Design


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
                notification.success({
                    message: 'Thành Công',
                    description: 'Combo đã được xóa thành công!',
                });
            } catch (err) {
                setError('Không thể xóa combo');
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể xóa combo',
                });
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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const totalPages = Math.ceil(filteredCombos.length / combosPerPage);
    
    const pageNumbers: (number | string)[] = [];
    if (totalPages <= 5) {
        pageNumbers.push(...Array.from({ length: totalPages }, (_, index) => index + 1));
    } else {
        pageNumbers.push(1, 2, 3, '...', totalPages);
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Link to={'/admin/combo/add'} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <FontAwesomeIcon icon={faPlus} />  Thêm Combo
                </Link>
                <input 
                    type="text" 
                    placeholder="Tìm kiếm theo tên combo..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-1/4"
                />
            </div>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-600">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-center">ID</th>
                            <th className="px-4 py-2 text-center">Tên Combo</th>
                            <th className="px-4 py-2 text-center">Mô Tả</th>
                            <th className="px-4 py-2 text-center">Giá</th>
                            <th className="px-4 py-2 text-center">Số Lượng</th>
                            <th className="px-4 py-2 text-center">Ngày Tạo</th>
                            <th className="px-4 py-2 text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCombos.map((combo) => (
                            <tr key={combo.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-center">{combo.id}</td>
                                <td className="px-4 py-3 text-center">{combo.combo_name}</td>
                                <td className="px-4 py-3 text-center">{combo.descripton}</td>
                                <td className="px-4 py-3 text-center">{formatPrice(combo.price)}</td>
                                <td className="px-4 py-3 text-center">{combo.volume}</td>
                                <td className="px-4 py-3 text-center">{new Date(combo.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center space-x-3">
                                        <Link
                                            to={`/admin/combo/edit/${combo.id}`}
                                            className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center hover:bg-yellow-200 transition"
                                        >
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.439 19.274a4.5 4.5 0 01-1.691 1.074l-3.003 1.001 1.001-3.003a4.5 4.5 0 011.074-1.691L16.862 3.487z"
                                                />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(combo.id)}
                                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
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
            <div className="flex justify-center items-center mt-6">
                <nav className="flex space-x-2">
                    <button
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
                    >
                        Trước
                    </button>
                    {pageNumbers.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(page as number)}
                            className={`px-4 py-2 rounded-lg border ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
                    >
                        Tiếp
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default ComboDashboard;
