import { Booking } from "../../../interface/Booking";
import instance from "../../../server";

import { useEffect, useState } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

const OrdersDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await instance.get(`/order?page=${currentPage}`);
        console.log("API Response:", response.data);
        setBookings(response.data.data.data);
        setTotalPages(response.data.data.last_page);
                setNextPageUrl(response.data.data.next_page_url);
                setPrevPageUrl(response.data.data.prev_page_url);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đặt vé:", error);
      }
    };
  
    fetchBookings();
  }, [currentPage]);
  console.log(bookings);
  
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
};

  return (
    <div className="container mt-5">
    
      <div className="d-flex justify-content-between align-items-center mb-4">
 
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="thead-light">
            <tr>
              <th>ID</th>
              <th>Người Dùng</th>
              <th>Suất Chiếu</th>
              <th>Phim</th>
              <th>Phương Thức Thanh Toán</th>
              {/* <th>Giá Vé</th>
              <th>Giá Combo</th> */}
              <th>Tổng Tiền</th>
              <th>Trạng Thái</th>
             
            </tr>
          </thead>
          <tbody>
  {bookings.length > 0 ? (
    bookings.map((booking: Booking) => (
      <tr key={booking.id}>
        <td>{booking.id}</td>
        <td>{booking.user?.user_name || "Unknown User"}</td>
        <td>{booking.showtime?.showtime_date || "Unknown Showtime"}</td>
        <td>{booking.showtime?.movie_in_cinema.movie.movie_name || "Unknown Movie"}</td>
        <td>{booking.pay_method?.pay_method_name || "Unknown Payment Method"}</td>
        {/* <td>${booking.price_ticket?.toFixed(2) || "0.00"}</td>
        <td>${booking.price_combo?.toFixed(2) || "0.00"}</td> */}
        <td>{booking.amount}</td>
        <td>{booking.status}</td>
        
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={10} className="text-center">
        Không có đơn hàng nào.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
      <nav className="d-flex justify-content-center mt-4">
    <ul className="pagination">
        {/* Previous Page Button */}
        <li className={`page-item ${!prevPageUrl ? 'disabled' : ''}`}>
            <button
                className="page-link"
                onClick={() => prevPageUrl && setCurrentPage(currentPage - 1)}
                disabled={!prevPageUrl}
            >
                Trước
            </button>
        </li>

        {/* Page Numbers */}
        {totalPages > 5 && currentPage > 3 && (
            <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(1)}>
                    1
                </button>
            </li>
        )}
        
        {totalPages > 5 && currentPage > 4 && (
            <li className="page-item disabled">
                <span className="page-link">...</span>
            </li>
        )}

        {[...Array(5)].map((_, index) => {
            const pageNumber = currentPage - 2 + index;
            if (pageNumber >= 1 && pageNumber <= totalPages) {
                return (
                    <li
                        key={pageNumber}
                        className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                        <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                            {pageNumber}
                        </button>
                    </li>
                );
            }
            return null;
        })}

        {totalPages > 5 && currentPage < totalPages - 3 && (
            <li className="page-item disabled">
                <span className="page-link">...</span>
            </li>
        )}

        {totalPages > 5 && currentPage < totalPages - 2 && (
            <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </button>
            </li>
        )}

        {/* Next Page Button */}
        <li className={`page-item ${!nextPageUrl ? 'disabled' : ''}`}>
            <button
                className="page-link"
                onClick={() => nextPageUrl && setCurrentPage(currentPage + 1)}
                disabled={!nextPageUrl}
            >
                Tiếp
            </button>
        </li>
    </ul>
</nav>
    </div>
  );
};

export default OrdersDashboard;
