import { Booking } from "../../../interface/Booking";
import instance from "../../../server";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { notification } from "antd"; // Import notification from Ant Design
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

const OrdersDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>(""); // Thêm trạng thái lọc
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

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
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pain':
        return 'bg-green-100 text-green-600';
      case 'Confirmed':
        return 'bg-green-100 text-green-600';
      // case 'Confirmed':
      //   return 'bg-red-100 text-red-600';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  const handlePrintInvoice = (booking: Booking) => {
    console.log("Booking for printing:", booking); // Kiểm tra dữ liệu
    const invoiceWindow = window.open("", "_blank");
  
    if (!invoiceWindow) {
      console.error("Không thể mở cửa sổ mới để in hóa đơn.");
      return;
    }
  
    const invoiceContent = `
      <html>
      <head>
        <title>Hóa đơn</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <h1>Hóa đơn</h1>
        <p><strong>Mã Đơn Hàng:</strong> ${booking.id}</p>
        <p><strong>Người Dùng:</strong> ${booking.user?.user_name || "Không xác định"}</p>
        <p><strong>Email:</strong> ${booking.user?.email || "Không xác định"}</p>
        <p><strong>SĐT:</strong> ${booking.user?.phone || "Không xác định"}</p>
        <p><strong>Suất Chiếu:</strong> ${booking.showtime?.showtime_date || "Không xác định"}</p>
        <p><strong>Phim:</strong> ${booking.showtime?.movie_in_cinema.movie.movie_name || "Không xác định"}</p>
        <p><strong>Phương Thức Thanh Toán:</strong> ${booking.pay_method?.pay_method_name || "Không xác định"}</p>
        <p><strong>Tổng Tiền:</strong> ${booking.amount}</p>
        <hr />
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      </body>
      </html>
    `;
  
    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
    invoiceWindow.print();
  };
  
  

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-5xl font-bold mb-4 text-center">Doanh Thu</h2>
      <div className="summary">
  {/* Box 1: Weekly Sales */}
  <div className="summary-card" style={{ background: 'linear-gradient(to right, #ffafbd, #ffc3a0)' }}>
    <div className="summary-card-header">
      <i className="fas fa-chart-line summary-icon"></i>
      <h3>Đơn Hàng</h3>
    </div>
    <div className="summary-number">$ 15,0000</div>
    <div className="summary-footer">
      <span className="summary-change positive">
        
      </span>
    </div>
  </div>

  {/* Box 2: Weekly Orders */}
  <div className="summary-card" style={{ background: 'linear-gradient(to right, #36d1dc, #5b86e5)' }}>
    <div className="summary-card-header">
      <i className="fas fa-bookmark summary-icon"></i>
      <h3>Phân tích</h3>
    </div>
    <div className="summary-number">45,6334</div>
    <div className="summary-footer">
      <span className="summary-change negative">
        
      </span>
    </div>
  </div>

  {/* Box 3: Visitors Online */}
  <div className="summary-card" style={{ background: 'linear-gradient(to right, #96fbc4, #96fbc4)' }}>
    <div className="summary-card-header">
      <i className="fas fa-map-marker-alt summary-icon"></i>
      <h3>Tổng Doanh Thu</h3>
    </div>
    <div className="summary-number">95,5741</div>
    <div className="summary-footer">
      <span className="summary-change positive">
      </span>
    </div>
  </div>

  
</div>
      
<div className="mb-6">
        {/* Bộ lọc */}
        <div className="flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/4 focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Paid">Paid</option>
          </select>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
          />
           <input
            type="text"
            placeholder="Tìm kiếm theo ID hoặc Tên người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-[36.8%] focus:outline-none"
          />
        </div>
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
                  <td className="px-4 py-3 text-center">
                    <span className={`px-4 py-2 rounded-full ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
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
                      <button
  onClick={() => handlePrintInvoice(booking)}
  className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition"
>
  <FontAwesomeIcon icon={faPrint} className="w-5 h-5" />
</button>
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
