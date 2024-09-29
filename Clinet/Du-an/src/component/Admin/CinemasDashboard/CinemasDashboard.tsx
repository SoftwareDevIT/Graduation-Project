
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import './CinemasDashboard.css';
import { Cinema } from '../../../interface/Cinema';
import instance from '../../../server';

const CinemasDashboard: React.FC = () => {
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 5; // Số lượng cinema trên mỗi trang
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchCinemas = async () => {
            try {
                const response = await instance.get('/cinema');
                setCinemas(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Không thể lấy danh sách rạp');
                setLoading(false);
            }
        };

        fetchCinemas();
    }, []);

    const pageCount = Math.ceil(cinemas.length / itemsPerPage);
    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const currentCinemas = cinemas.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="cinemas-dashboard">
            <h2>Tất cả các rạp chiếu</h2>
            <div className="table-container">
                <table className="cinema-table">
                    <thead>
                        <tr>
                            <th>ID Rạp</th>
                            <th>Tên Rạp</th>
                            <th>Điện Thoại</th>
                            <th>Địa Chỉ</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCinemas.map((cinema) => (
                            <tr key={cinema.id}>
                                <td>{cinema.id}</td>
                                <td>{cinema.cinema_name}</td>
                                <td>{cinema.phone}</td>
                                <td>{cinema.cinema_address}</td>
                                <td>{cinema.status}</td>
                                <td className="action-buttons">
                                    <button className="view-btn">👁</button>
                                    <button className="edit-btn">✏️</button>
                                    <button className="delete-btn">🗑</button>
                                </td>
                            </tr>
                        ))}
                        {currentCinemas.length === 0 && (
                            <tr>
                                <td colSpan={6}>Không có rạp nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <ReactPaginate
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5} // Số lượng trang hiển thị
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    activeClassName={"active"}
                />
            </div>
        </div>
    );

import React from 'react';
import { Link } from 'react-router-dom';
import './CinemasDashboard.css'

import instance from '../../../server'; // Ensure you have the correct path
import { useCinemaContext } from '../../../Context/CinemasContext';

const CinemasDashboard: React.FC = () => {
  const { state, dispatch } = useCinemaContext();
  const { cinemas } = state;

  const handleDeleteCinema = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this cinema?")) {
      try {
        await instance.delete(`/cinema/${id}`);
        dispatch({ type: 'DELETE_CINEMA', payload: id });
        alert("Cinema deleted successfully!");
      } catch (err) {
        console.error("Failed to delete cinema:", err);
        alert("Failed to delete cinema");
      }
    }
  };

  return (
    <div className="cinemas-dashboard">
      <h2>All Cinemas</h2>
      <div className="actions">
        <Link to={'/admin/cinemas/add'} className="add-cinema-btn">Add Cinema</Link>
      </div>
      <div className="table-container">
        <table className="cinema-table">
          <thead>
            <tr>
              <th>Cinema ID</th>
              <th>Cinema Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cinemas.map((cinema) => (
              <tr key={cinema.id}>
                <td>{cinema.id}</td>
                <td>{cinema.cinema_name}</td>
                <td>{cinema.phone}</td>
                <td>{cinema.cinema_address}</td>
                <td>{cinema.status}</td>
                <td>
                  <Link to={`/admin/cinemas/edit/${cinema.id}`} className="edit-btn">Edit</Link>
                  <button onClick={() => handleDeleteCinema(cinema.id!)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

};

export default CinemasDashboard;
