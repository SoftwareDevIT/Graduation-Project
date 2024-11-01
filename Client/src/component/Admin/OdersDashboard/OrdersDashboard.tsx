import { Booking } from "../../../interface/Booking";
import instance from "../../../server";
import "./OrdersDashboard.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const OrdersDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await instance.get("/order");
        setBookings(response.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);



  return (
    <div className="orders-management">
      <h2>Order Management</h2>
      <div className="actions">
        <button className="add-order-btn">Add Order</button>
      </div>
      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Showtime</th>
              <th>Movie</th>
              <th>Pay Method</th>
              <th>Price Ticket</th>
              <th>Price Combo</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking: Booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.user.user_name}</td>
                  <td>{booking.showtime.showtime_date}</td>
                  <td>{booking.showtime.movie_in_cinema_id}</td>
                  <td>{booking.pay_method.pay_method_name}</td>
                  <td>${booking.price_ticket.toFixed(2)}</td>
                  <td>${booking.price_combo.toFixed(2)}</td>
                  <td>{booking.amount}</td>
                  <td>{booking.seat_status}</td>
                  <td className="action-buttons">
                    <button className="edit-btn" title="Edit">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="delete-btn" title="Delete" >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} style={{ textAlign: "center" }}>
                  No bookings available.
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
