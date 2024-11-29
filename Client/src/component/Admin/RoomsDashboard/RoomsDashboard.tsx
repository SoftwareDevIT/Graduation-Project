import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { notification } from 'antd'; // Import notification from Ant Design
import instance from '../../../server';
import { Room } from '../../../interface/Room';

const RoomDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const roomsPerPage = 7; // Số lượng phòng hiển thị mỗi trang

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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Link to={'/admin/rooms/add'} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <FontAwesomeIcon icon={faPlus} /> Thêm Phòng
        </Link>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên phòng"
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
              <th className="px-4 py-2 text-center">Tên Phòng</th>
              <th className="px-4 py-2 text-center">Tổng số ghế</th>
              <th className="px-4 py-2 text-center">Số Ghế Đôi</th>
              <th className="px-4 py-2 text-center">Số Ghế VIP</th>
              <th className="px-4 py-2 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {currentRooms.length > 0 ? (
              currentRooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">{room.id}</td>
                  <td className="px-4 py-3 text-center">{room.room_name}</td>
                  <td className="px-4 py-3 text-center">{room.volume}</td>
                  <td className="px-4 py-3 text-center">{room.quantity_double_seats}</td>
                  <td className="px-4 py-3 text-center">{room.quantity_vip_seats}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center space-x-3">
                      <Link
                        to={`/admin/rooms/edit/${room.id}`}
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
                        onClick={() => handleDelete(room.id)}
                        className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
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
      <div className="flex justify-center items-center mt-6">
        <nav className="flex space-x-2">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
          >
            Trước
          </button>
          {paginationRange().map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(page as number)}
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

export default RoomDashboard;
