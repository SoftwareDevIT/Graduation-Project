import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { notification } from 'antd'; // Import notification from Ant Design
import instance from '../../../server';
import { Room } from '../../../interface/Room';

const RoomDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const roomsPerPage = 11; // Số lượng phòng hiển thị mỗi trang

  useEffect(() => {
    // Lấy danh sách phòng từ API
    const fetchRooms = async () => {
      try {
        const response = await instance.get('/room');
        setRooms(response.data.data);
        setFilteredRooms(response.data.data); // Khởi tạo danh sách phòng đã lọc với tất cả các phòng
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phòng:', error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    // Lọc danh sách phòng theo từ khóa tìm kiếm
    const filtered = rooms.filter((room) =>
      room.room_name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
    setFilteredRooms(filtered);
    setCurrentPage(1); // Đặt lại về trang đầu tiên khi từ khóa tìm kiếm thay đổi
  }, [searchTerm, rooms]);

  const totalRooms = filteredRooms.length;
  const totalPages = Math.ceil(totalRooms / roomsPerPage);

  // Lấy danh sách phòng cho trang hiện tại
  const currentRooms = filteredRooms.slice(
    (currentPage - 1) * roomsPerPage,
    currentPage * roomsPerPage
  );

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");
    if (confirmDelete) {
      try {
        await instance.delete(`/room/${id}`);
        setRooms(rooms.filter(room => room.id !== id)); // Cập nhật lại danh sách phòng sau khi xóa
        setFilteredRooms(filteredRooms.filter(room => room.id !== id)); // Cập nhật danh sách phòng đã lọc
        notification.success({
          message: 'Xóa phòng thành công!',
          description: 'Phòng đã được xóa khỏi hệ thống.',
        }); // Hiển thị thông báo thành công
      } catch (error) {
        console.error('Lỗi khi xóa phòng:', error);
      }
    }
  };

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => setCurrentPage(page);

  // Tạo dãy trang phân trang (tối đa 5 trang)
  const paginationRange = () => {
    const range = [];
    const maxPagesToShow = 5;
    const halfMax = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      // Hiển thị tất cả các trang nếu số trang nhỏ hơn hoặc bằng maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - halfMax);
      const end = Math.min(totalPages, currentPage + halfMax);

      if (start > 1) range.push(1);
      if (start > 2) range.push('...');

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      if (end < totalPages - 1) range.push('...');
      if (end < totalPages) range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="container mt-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to={'/admin/rooms/add'} className="btn btn-outline-primary">
         + Thêm Phòng
        </Link>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên phòng"
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
              <th>Tên Phòng</th>
              <th>Tổng số ghế</th>
              <th>Số Ghế Đôi</th>
              <th>Số Ghế VIP</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {currentRooms.length > 0 ? (
              currentRooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.room_name}</td>
                  <td>{room.volume}</td>
                  <td>{room.quantity_double_seats}</td>
                  <td>{room.quantity_vip_seats}</td>
                  <td>
                    <Link to={`/admin/rooms/edit/${room.id}`} className="btn btn-warning btn-sm mx-1">
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="btn btn-danger btn-sm"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  Không có phòng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Phân trang */}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
              Trước
            </button>
          </li>
          {paginationRange().map((page, index) => (
            <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              {page === '...' ? (
                <span className="page-link">...</span>
              ) : (
                <button className="page-link" onClick={() => handlePageChange(page as number)}>
                  {page}
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

export default RoomDashboard;
