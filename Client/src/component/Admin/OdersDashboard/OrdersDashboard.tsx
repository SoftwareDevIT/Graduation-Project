import { Booking } from "../../../interface/Booking";
import instance from "../../../server";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrdersDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await instance.get("/order");
        console.log("API Response:", response.data);
        setBookings(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đặt vé:", error);
      }
    };
  
    fetchBookings();
  }, []);
  

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Quản lý Đơn Hàng</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-primary">Thêm Đơn Hàng</button>
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
              <th>Số Lượng</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
  {bookings.length > 0 ? (
    bookings.map((booking: Booking) => (
      <tr key={booking.id}>
        <td>{booking.id}</td>
        <td>{booking.user?.user_name || "Unknown User"}</td>
        <td>{booking.showtime?.showtime_date || "Unknown Showtime"}</td>
        <td>{booking.showtime?.movie_in_cinema_id || "Unknown Movie"}</td>
        <td>{booking.pay_method?.pay_method_name || "Unknown Payment Method"}</td>
        {/* <td>${booking.price_ticket?.toFixed(2) || "0.00"}</td>
        <td>${booking.price_combo?.toFixed(2) || "0.00"}</td> */}
        <td>{booking.amount}</td>
        <td>{booking.status}</td>
        <td className="action-buttons2">
          <button className="btn btn-warning btn-sm mx-1" title="Sửa">
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button className="btn btn-danger btn-sm" title="Xóa">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </td>
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
    </div>
  );
};

export default OrdersDashboard;
