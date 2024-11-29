import { Booking } from "../../../interface/Booking";
import instance from "../../../server";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { notification } from "antd"; // Import notification from Ant Design

const OrdersDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await instance.get(`/order?page=${currentPage}`);
        console.log("API Response:", response.data);
        setBookings(response.data.data.data);
        setTotalPages(response.data.data.last_page);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đặt vé:", error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải thông tin đơn hàng.',
        });
      }
    };

    fetchBookings();
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
  };

  const getPaginationPages = () => {
    let pages: number[] = [];

    if (totalPages <= 5) {
      // If there are 5 or fewer pages, show all pages
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        // Show the first 5 pages
        pages = [1, 2, 3, 4, 5];
      } else if (currentPage >= totalPages - 2) {
        // Show the last 5 pages
        pages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        // Show 2 pages before and after the current page
        pages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
      }
    }

    return pages;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
       <div></div>
        <input
          type="text"
          placeholder="Tìm kiếm theo ID đơn hàng..."
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
              <th className="px-4 py-2 text-center">Người Dùng</th>
              <th className="px-4 py-2 text-center">Suất Chiếu</th>
              <th className="px-4 py-2 text-center">Phim</th>
              <th className="px-4 py-2 text-center">Phương Thức Thanh Toán</th>
              <th className="px-4 py-2 text-center">Tổng Tiền</th>
              <th className="px-4 py-2 text-center">Trạng Thái</th>
              <th className="px-4 py-2 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking: Booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">{booking.id}</td>
                  <td className="px-4 py-3 text-center">{booking.user?.user_name || "Unknown User"}</td>
                  <td className="px-4 py-3 text-center">{booking.showtime?.showtime_date || "Unknown Showtime"}</td>
                  <td className="px-4 py-3 text-center">{booking.showtime?.movie_in_cinema.movie.movie_name || "Unknown Movie"}</td>
                  <td className="px-4 py-3 text-center">{booking.pay_method?.pay_method_name || "Unknown Payment Method"}</td>
                  <td className="px-4 py-3 text-center">{booking.amount}</td>
                  <td className="px-4 py-3 text-center">{booking.status}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center space-x-3">
                      <Link
                        to={`/admin/orders/edit/${booking.id}`}
                        className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center hover:bg-yellow-200 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.439 19.274a4.5 4.5 0 01-1.691 1.074l-3.003 1.001 1.001-3.003a4.5 4.5 0 011.074-1.691L16.862 3.487z" />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">Không có đơn hàng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6">
        <nav className="flex space-x-2">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border bg-gray-200 hover:bg-gray-300"
          >
            Trước
          </button>

          {getPaginationPages().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg border ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {page}
            </button>
          ))}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className="px-4 py-2 text-gray-500">...</span>
          )}

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

export default OrdersDashboard;
