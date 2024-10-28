import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import instance from '../../server';
import { message } from 'antd'; // Import message từ Ant Design
import Headerticket from '../Headerticket/Headerticket';
import Footer from '../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faMobileAlt, faQrcode, faUniversity, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import './OderCheckOut.css';
import Header from '../Header/Hearder';

const OrderCheckout = () => {
  const location = useLocation();
  const { movieName, cinemaName, showtime, selectedSeats, totalPrice, selectedCombos } = location.state || {};

  // State lưu phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState<string>(''); // Thêm state để lưu phương thức thanh toán

  const handleCheckout = async () => {
    const cinemaId = location.state?.cinemaId;
    const showtimeId = location.state?.showtimeId;
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
  
    if (!token) {
      message.warning('Vui lòng đăng nhập trước khi đặt vé.');
      return;
    }
  
    if (!cinemaId || !showtimeId || !selectedSeats || !userId) {
      message.warning('Thông tin không đầy đủ. Vui lòng kiểm tra lại.');
      return;
    }
  
    if (!paymentMethod) {
      message.warning('Vui lòng chọn phương thức thanh toán.');
      return;
    }
  
    // Xây dựng bookingData dựa trên dữ liệu thực tế
    const bookingData = {
      cinemaId: cinemaId,
      showtimeId: showtimeId,
      showtime_id: showtimeId,
      pay_method_id: paymentMethod === 'vnpay' ? 1 : 2,
      seats: selectedSeats.map((seat: any) => ({
        seat_name: seat.seat_name,
        room_id: seat.room_id,
        showtime_id: showtimeId,
        seat_row: seat.seat_row,
        seat_column: seat.seat_column,
      })),
      comboId: selectedCombos.map((combo: any) => ({
        id: combo.id,
        quantity: combo.quantity,
      })),
      amount: totalPrice,
    };
  
    try {
      const response = await instance.post('/book-ticket', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.data) {
        if (paymentMethod === 'vnpay') {
          window.location.href = response.data.data;
        } else {
          message.success('Đặt vé thành công.');
        }
      }
    } catch (error) {
      console.error('Đặt vé thất bại:', error);
      message.error('Đặt vé thất bại. Vui lòng thử lại.');
    }
  };
  
  
  return (
    <>
      <Header />
      <Headerticket />
      <div className="order-checkout-container">
        <div className="left-panel">
          <div className="order-summary">
            {/* Hiển thị tóm tắt đơn hàng */}
            <div className="order-header">
              <h3>Tóm tắt đơn hàng</h3>
            </div>
            <div className="item-header">
              <span>Mô Tả</span>
              <span>Số Lượng</span>
              <span>Thành Tiền</span>
            </div>
            <div className="order-item">
              <span className="item-title">Phim: {movieName}</span>
              <span className="item-quantity">1</span>
              <span className="item-price">{totalPrice?.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="order-item">
              <span className="item-title">Rạp: {cinemaName}</span>
            </div>
            <div className="order-item">
              <span className="item-title">Suất chiếu: {showtime}</span>
            </div>
            <div className="order-item">
              <span className="item-title">Ghế đã chọn: {selectedSeats}</span>
            </div>
            {/* Hiển thị combo nếu có */}
            {selectedCombos && selectedCombos.length > 0 && (
              <div className="combo-summary">
                <h4>Combo đã chọn:</h4>
                {selectedCombos.map((combo: any, index: number) => (
                  <div key={index} className="order-item">
                    <span className="item-title">Combo: {combo.name}</span>
                    <span className="item-quantity">Số lượng: {combo.quantity}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="order-total">
              <span className="total-title">Tổng</span>
              <span className="total-price">{totalPrice?.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          {/* Hình thức thanh toán */}
          <div className="payment-methods">
            <h3>Hình thức thanh toán</h3>
            {/* Các phương thức thanh toán */}
            <ul>
              <li
               onClick={() => {
                setPaymentMethod('vnpay');
                console.log('Phương thức thanh toán đã được chọn: vnpay');
              }}
              >
                <FontAwesomeIcon icon={faWallet} className="payment-icon" /> VN Pay
              </li>
              <li
                onClick={() => setPaymentMethod('momo')} // Các phương thức khác
              >
                <FontAwesomeIcon icon={faMobileAlt} className="payment-icon" /> Ví MoMo
              </li>
              <li><FontAwesomeIcon icon={faQrcode} className="payment-icon" /> Quét mã QR</li>
              <li><FontAwesomeIcon icon={faUniversity} className="payment-icon" /> Chuyển khoản / Internet Banking</li>
              <li><FontAwesomeIcon icon={faWallet} className="payment-icon" /> Ví ShopeePay</li>
              <li><FontAwesomeIcon icon={faCreditCard} className="payment-icon" /> Thẻ ATM (Thẻ nội địa)</li>
              <li><FontAwesomeIcon icon={faWallet} className="payment-icon" /> Ví FPT Pay</li>
            </ul>
          </div>
          
          {/* Thông tin cá nhân */}
          <div className="form-container">
            <h3>Thông tin cá nhân</h3>
            <form>
              <div className="form-group">
                <label htmlFor="fullname">Họ và tên</label>
                <input
                  type="text"
                  id="fullname"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Nhập email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              <div className="form-group checkbox-group">
                <input type="checkbox" id="create-account" />
                <label htmlFor="create-account">Tạo tài khoản với email và số điện thoại này</label>
              </div>
            </form>
          </div>
        </div>

        {/* Thông tin thanh toán bên phải */}
        <div className="right-panel">
          <div className="checkout-details">
            <div className="order-info">
              <span className="total-title">Tổng đơn hàng</span>
              <h2 className="total-price">{totalPrice?.toLocaleString('vi-VN')} đ</h2>
            </div>
            <div className="time-info">
              <span className="time-title">Thời gian giữ ghế</span>
              <h2 className="time-remaining">03:32</h2>
            </div>
            <div className="description">
              <p>
                Vé đã mua không thể đổi hoặc hoàn tiền. Mã vé sẽ được gửi 01 lần qua số điện thoại và email đã nhập. Vui lòng kiểm tra lại thông tin trước khi tiếp tục.
              </p>
            </div>
            <button onClick={handleCheckout} className="checkout-button">Thanh toán</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderCheckout;
