import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../../server'; // API instance
import { Booking } from '../../../interface/Booking';
import "./OdersDetail.css"
import { Button, notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { CheckCircleOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';

const OrderDetail = () => {
  const { id } = useParams(); // Get the booking_id from the URL parameter
  const [orderDetails, setOrderDetails] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  

  useEffect(() => {

    const fetchOrderDetails = async () => {
      try {
        const response = await instance.get(`/order/${id}`); // Fetch the order details using the booking_id
        setOrderDetails(response.data.data);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!orderDetails) return <div>No order details found</div>;
  const handlePrintInvoice = (orderDetails: Booking) => {
    const invoiceWindow = window.open("", "_blank");
    if (!invoiceWindow) {
      notification.error({
        message: "Lỗi",
        description: "Không thể mở cửa sổ in hóa đơn.",
      });
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
        <p><strong>Mã Đơn Hàng:</strong> ${orderDetails.booking_code}</p>
        <p><strong>Người Dùng:</strong> ${orderDetails.user?.user_name || "Không xác định"}</p>
        <p><strong>Tên Đầy Đủ:</strong> ${orderDetails.user?.fullname || "Không xác định"}</p>
        <p><strong>Email:</strong> ${orderDetails.user?.email || "Không xác định"}</p>
        <p><strong>SĐT:</strong> ${orderDetails.user?.phone || "Không xác định"}</p>
        <p><strong>Suất Chiếu:</strong> ${orderDetails.showtime?.showtime_date || "Không xác định"}</p>
        <p><strong>Phim:</strong> ${orderDetails.showtime.movie.movie_name || "Không xác định"}</p>
       <p><strong>Ảnh:</strong>
  <img 
    src="${orderDetails.showtime.movie.poster}" 
    alt="Movie Poster" 
    style="max-width: 100px; max-height: 150px; width: auto; height: auto; object-fit: cover;" 
  />
</p>
        <p><strong>Phương Thức Thanh Toán:</strong> ${orderDetails.pay_method.pay_method_name}</p>
        <p><strong>Tên Khách Hàng:</strong> ${orderDetails.user.fullname}</p>
        <p><strong>Tổng Tiền:</strong> ${orderDetails.amount} VND</p>
        <hr />
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      </body>
      </html>
    `;
    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
    invoiceWindow.print();
  };
  const getStatusStyle = (status: any) => {
    switch (status) {
      case 'Pain':
        return {
          className: 'status-pain',
          icon: <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />,
        };
      case 'Confirmed':
        return {
          className: 'status-confirmed',
          icon: <ExclamationCircleOutlined style={{ color: 'orange', marginRight: 8 }} />,
        };
      case 'Pending':
        return {
          className: 'status-pending',
          icon: <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />,
        };
      default:
        return {
          className: 'status-default',
          icon: null,
        };
    }
  };
  const { className, icon } = getStatusStyle(orderDetails.status);
  return (
    <div className="order-detail">
      <h2>THÔNG TIN HÓA ĐƠN</h2>
      <div className="order-content">
        {/* Left Column: Main Details */}
        <div className="order-main">
          <table className="order-table">
            <thead>
              <tr>
                <th>Phim</th>
                <th>Suất chiếu</th>
                <th>Combo</th>
                <th>Vé</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src={orderDetails.showtime.movie.poster ?? ''} alt="Movie Thumbnail"  />
                  <span>{orderDetails.showtime.movie.movie_name}</span>
                </td>
                <td>
                  <p>Phòng: {orderDetails.showtime.room.room_name} <br /></p>
                  <p>Ngày Chiếu: {orderDetails.showtime.showtime_date}</p> <br />
                  <p>Suất Chiếu: {orderDetails.showtime.showtime_start} ~ {orderDetails.showtime.showtime_end}</p>
                </td>
                <td>
                 {orderDetails.combos.combo_name}
                 {orderDetails.combos.price}
                </td>
                <td>
                  {orderDetails.showtime.room.room_name}
                </td>
                
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Column: Sidebar */}
        <div className="order-sidebar">
        <div className={`ticket-status ${className}`}>
   <div className="trangthaive">
   <h3>Trạng thái vé</h3>
   <p>{icon} {orderDetails.status}</p>
   </div>
      <div className="ticket-content">
      <img src={orderDetails.qrcode} alt="" />
      <Button
        type="primary"
        icon={<FontAwesomeIcon icon={faPrint} />}
        onClick={() => handlePrintInvoice(orderDetails)}
      >
        In
      </Button>
      </div>
    </div>

          <div className="user-info">
            <h3>Thông tin người đặt</h3>
            <img src={orderDetails.user.avatar ?? ''} alt="User Avatar" />
            <p>{orderDetails.user.fullname}</p>
            <p>{orderDetails.user.email}</p>
            <p>{orderDetails.user.phone}</p>
          </div>

          <div className="payment-info">
            <h3>Thông tin thanh toán</h3>
            <p>Phương thức: {orderDetails.pay_method.pay_method_name}</p>
            <p>Tên khách hàng: {orderDetails.user.fullname}</p>
            <p>Tổng tiền: {orderDetails.amount} VNĐ</p>
       
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
