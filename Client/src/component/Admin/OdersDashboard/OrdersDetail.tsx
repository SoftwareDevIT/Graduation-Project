import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../../server'; // API instance
import { Booking } from '../../../interface/Booking';
import "./OdersDetail.css"
import { Button, notification, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';


const { Option } = Select;

const OrderDetail = () => {
  const { id } = useParams(); // Get the booking_id from the URL parameter
  const [orderDetails, setOrderDetails] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [newStatus, setNewStatus] = useState<string>(orderDetails?.status || ''); // State for new status

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await instance.get(`/order/${id}`); // Fetch the order details using the booking_id
        setOrderDetails(response.data.data);
        console.log("datacombo",response.data.data.combos.combo_name
        )
        setNewStatus(response.data.data.status); // Initialize status from the fetched data
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    try {
      await instance.put(`/order/${id}`, { status }); // PUT request to update status
      notification.success({
        message: 'Trạng thái đơn hàng đã được cập nhật!',
      });
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật trạng thái đơn hàng.',
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!orderDetails) return <div>No order details found</div>;

  const handlePrintInvoice = (orderDetails: Booking) => {
    if (!orderDetails.seats || orderDetails.seats.length === 0) {
      notification.error({
        message: "Lỗi",
        description: "Không có ghế nào để in hóa đơn.",
      });
      return;
    }
  
    // Mở cửa sổ in
    const invoiceWindow = window.open("", "_blank");
    if (!invoiceWindow) {
      notification.error({
        message: "Lỗi",
        description: "Không thể mở cửa sổ in hóa đơn.",
      });
      return;
    }
  
    const invoiceDetails = orderDetails.seats
      .map(
        (seat, index) => `
        <div style="page-break-after: always; border: 1px solid #e0e0e0; margin-bottom: 30px; padding: 20px; background-color: #f9f9f9;">
          <h1 style="text-align: center; color: #444; font-size: 24px; font-weight: bold;">Hóa Đơn Chi Tiết</h1>
          <div style="margin-bottom: 20px; text-align: center;">
            <img src="https://example.com/logo.png" alt="Logo" style="width: 150px; margin-bottom: 10px;" />
            <p><strong>CÔNG TY TNHH FLICKHIVE</strong></p>
            <p>Địa chỉ: Trịnh Văn Bô - Bắc Từ Liêm - Hà Nội</p>
            <p>Mã số thuế: 0315367026</p>
          </div>
          <hr />
          <p><strong>Mã Đơn Hàng:</strong> ${orderDetails.booking_code}</p>
          <p><strong>Người Dùng:</strong> ${orderDetails.user?.user_name || "Không xác định"}</p>
          <p><strong>Tên Đầy Đủ:</strong> ${orderDetails.user?.fullname || "Không xác định"}</p>
          <p><strong>Email:</strong> ${orderDetails.user?.email || "Không xác định"}</p>
          <p><strong>SĐT:</strong> ${orderDetails.user?.phone || "Không xác định"}</p>
          <hr />
          <p><strong>Phim:</strong> ${orderDetails.showtime.movie.movie_name || "Không xác định"}</p>
          <p><strong>Ngày:</strong> ${orderDetails.showtime?.showtime_date || "Không xác định"}</p>
          <p><strong>Suất Chiếu:</strong> ${orderDetails.showtime?.showtime_start} ~ ${orderDetails.showtime?.showtime_end} </p>
          <p><strong>Phòng:</strong> ${orderDetails.showtime?.room.room_name || "Không xác định"}</p>
          <p><strong>Ghế:</strong> ${orderDetails.seats.map(seat => seat.seat_name).join(", ")}</p>
          <hr />
          <p><strong>Phương Thức Thanh Toán:</strong> ${orderDetails.pay_method.pay_method_name}</p>
          <p><strong>Tổng Tiền:</strong> ${formatCurrency(orderDetails.amount)} VNĐ</p>
          <hr />
          <div style="text-align: center; margin-top: 20px;">
            <strong><img src="${orderDetails.barcode}" alt="Barcode" style="width: 200px; display: block; margin: 0 auto;" /></strong>
            <p style="font-style: italic; color: #777;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
          </div>
        </div>`
      )
      .join("");
  
    // Tạo nội dung cho hóa đơn ghế
    const invoiceSeats = orderDetails.seats
      .map(
        (seat) => `
        <div style="page-break-after: always; border: 1px solid #e0e0e0; margin-bottom: 30px; padding: 20px; background-color: #f9f9f9;">
          <h1 style="text-align: center; color: #444; font-size: 24px; font-weight: bold;">Vé Xem Phim</h1>
          <div style="margin-bottom: 20px; text-align: center;">
            <img src="https://example.com/logo.png" alt="Logo" style="width: 150px; margin-bottom: 10px;" />
            <p><strong>CÔNG TY TNHH FLICKHIVE</strong></p>
            <p>Địa chỉ: Trịnh Văn Bô - Bắc Từ Liêm - Hà Nội</p>
            <p>Mã số thuế: 0315367026</p>
          </div>
          <hr />
          <p><strong>Phim:</strong> ${orderDetails.showtime.movie.movie_name || "Không xác định"}</p>
          <p><strong>Ngày:</strong> ${orderDetails.showtime?.showtime_date || "Không xác định"}</p>
          <p><strong>Suất Chiếu</strong> ${orderDetails.showtime?.showtime_start} ~ ${orderDetails.showtime?.showtime_end} </p>
          <p><strong>Phòng:</strong> ${orderDetails.showtime?.room.room_name || "Không xác định"}</p>
          <p><strong>Ghế:</strong> ${seat.seat_name}</p>
          <hr />
          <p><strong>Phương Thức Thanh Toán:</strong> ${orderDetails.pay_method.pay_method_name}</p>
          <p><strong>Tổng Tiền:</strong> ${formatCurrency(orderDetails.showtime.price)} VNĐ</p>
          <hr />
          <div style="text-align: center; margin-top: 20px;">
            <strong><img src="${orderDetails.barcode}" alt="Barcode" style="width: 200px; display: block; margin: 0 auto;" /></strong>
            <p style="font-style: italic; color: #777;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
          </div>
        </div>`
      )
      .join("");
  
    // Tạo nội dung hóa đơn Combo với ngắt trang trước
    const invoiceCombos = orderDetails.combos
      .map(
        (combo) => `
        <div style="page-break-before: always; border: 1px solid #e0e0e0; margin-bottom: 50px; padding: 20px; background-color: #f9f9f9;">
          <h1 style="text-align: center; color: #444; font-size: 24px; font-weight: bold;">Hóa Đơn Combo</h1>
          <div style="margin-bottom: 20px; text-align: center;">
            <img src="https://example.com/logo.png" alt="Logo" style="width: 150px; margin-bottom: 10px;" />
            <p><strong>CÔNG TY TNHH FLICKHIVE</strong></p>
            <p>Địa chỉ: Trịnh Văn Bô - Bắc Từ Liêm - Hà Nội</p>
            <p>Mã số thuế: 0315367026</p>
          </div>
          <hr />
          <p><strong>Mã Đơn Hàng:</strong> ${orderDetails.booking_code}</p>
          <p><strong>Combo:</strong> ${combo.combo_name}</p>
          <p><strong>Giá Combo:</strong> ${formatCurrency(combo.price)} VNĐ</p>
          <hr />
          <div style="text-align: center; margin-top: 20px;">
            <strong><img src="${orderDetails.barcode}" alt="Barcode" style="width: 200px; display: block; margin: 0 auto;" /></strong>
            <p style="font-style: italic; color: #777;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
          </div>
        </div>`
      )
      .join("");
  
    // Gộp tất cả hóa đơn vào một trang
    const invoiceContent = `
      <html>
      <head>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 20px; color: #444; }
          h1 { font-size: 24px; font-weight: bold; text-align: center; color: #444; }
          .invoice-section { border: 1px solid #e0e0e0; margin-bottom: 30px; padding: 20px; background-color: #f9f9f9; }
          .invoice-section + .invoice-section { page-break-before: always; }
          .invoice-section:last-child { page-break-after: avoid; }
        </style>
      </head>
      <body>
        ${invoiceDetails}
        ${invoiceSeats}
        ${invoiceCombos}
      </body>
      </html>
    `;
  
    invoiceWindow.document.write(invoiceContent); // Ghi nội dung hóa đơn vào cửa sổ
    invoiceWindow.document.close(); // Đóng nội dung để chuẩn bị in
    invoiceWindow.print(); // Kích hoạt in
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
  const formatCurrency = (amount: any) => {
    return amount.toLocaleString('vi-VN');
  }
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
                  <img src={orderDetails.showtime.movie.poster ?? ''} alt="Movie Thumbnail" />
                  <span>{orderDetails.showtime.movie.movie_name}</span>
                </td>
                <td>
                  <p>{orderDetails.showtime.room.room_name}</p>
                  <p>{orderDetails.showtime.showtime_date}</p>
                  <p>{orderDetails.showtime.showtime_start} ~ {orderDetails.showtime.showtime_end}</p>
                </td>
                <td>
  {orderDetails.combos?.length > 0 ? (
    orderDetails.combos.map((combos, index) => (
      <div key={index}>
        <p><strong>{combos.combo_name} x {combos.volume}</strong></p>
        <p>({formatCurrency(combos.price)} VNĐ)</p>
      </div>
    ))
  ) : (
    <p>Không có combo nào</p>
  )}
</td>

<td>
  {orderDetails.seats.length > 0 ? (
    orderDetails.seats.map((seats, index) => (
      <div key={index}>
        <p>{seats.seat_name}({seats.type})</p>
      </div>
    ))
  ) : (
    <p>Không có combo nào</p>
  )}
</td>

              </tr>
            </tbody>
          </table>
          <div className="tongtien">
  <p><strong>Tiền Vé:</strong> {formatCurrency(orderDetails.showtime.price * orderDetails.seats.length)} VNĐ</p><br />
  
  {orderDetails.combos?.length > 0 ? (
    orderDetails.combos.map((combos, index) => (
      <div key={index}>
        <p><strong>Giá Combos:</strong> {formatCurrency(combos.price)} VNĐ</p><br />
      </div>
    ))
  ) : (
    <p>Không có combo nào</p>
  )}
  
  <p><strong>Tổng tiền: {formatCurrency(orderDetails.amount)} VNĐ</strong></p>
</div>

        </div>

        {/* Right Column: Sidebar */}
        <div className="order-sidebar">
          <div className={`ticket-status ${className}`}>
            <div className="trangthaive">
              <h3>Trạng thái vé</h3>
              <Select
                value={newStatus}
                onChange={(value) => {
                  setNewStatus(value);
                  handleUpdateStatus(value); // Update status immediately when selected
                }}
                style={{ width: '30%', marginTop:"-8px" }}
              >
                <Option value="Pain">Paid</Option>
                <Option value="Confirmed">Confirmed</Option>
                <Option value="Pending">Pending</Option>
              </Select>
            </div>

            <div className="ticket-content">
              <img src={orderDetails.barcode} alt="" />
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
            <ul>
              <li>Tên khách hàng: {orderDetails.user?.fullname}</li>
              <li>Email: {orderDetails.user?.email}</li>
              <li>Phone: {orderDetails.user?.phone}</li>
              <li>Địa chỉ: {orderDetails.user?.address}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
