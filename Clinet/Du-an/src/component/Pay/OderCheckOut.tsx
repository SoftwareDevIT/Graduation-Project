import React from 'react';
import { useLocation } from 'react-router-dom';
import instance from '../../server';
import Header from '../Header/Hearder';
import Headerticket from '../Headerticket/Headerticket';
import Footer from '../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faMobileAlt, faQrcode, faUniversity, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import './OderCheckOut.css';

const OrderCheckout = () => {
  const location = useLocation();
  const {
    movieName,
    cinemaName,
    showtime,
    selectedSeats,
    totalPrice,
    selectedCombos,
  } = location.state || {};

  const handleCheckout = async () => {
    const cinemaId = location.state?.cinemaId;
    const showtimeId = location.state?.showtimeId;
    const roomId = location.state?.roomId;

    if (!cinemaId || !showtimeId || !selectedSeats) {
      console.error('cinemaId, showtimeId hoặc ghế ngồi không được tìm thấy');
      return;
    }

    const seats = selectedSeats.split(",").map((seatName: string) => {
      const trimmedSeat = seatName.trim();
      const row = trimmedSeat.charAt(0);
      const column = parseInt(trimmedSeat.slice(1)) - 1;

      return {
        seat_name: trimmedSeat,
        room_id: roomId,
        showtime_id: showtimeId,
        seat_row: row,
        seat_column: column,
      };
    });

    const bookingData = {
      cinemaId: cinemaId,
      showtimeId: showtimeId,
      seats: seats,
      amount: totalPrice,
      comboId: selectedCombos,
    };

    try {
      // Gửi yêu cầu đặt vé
      console.log(bookingData);
      
      const response = await instance.post('/book-ticket', bookingData);
      console.log('Đặt vé thành công:', response.data.data);

      if (response.data.data) {
        const vnpayUrl = response.data.data.data;
        console.log('Chuyển hướng đến VNPAY:', vnpayUrl);

        // Chuyển hướng người dùng đến VNPAY
        window.location.href = vnpayUrl;
      } else {
        console.error('Không tìm thấy URL VNPAY hoặc dữ liệu không hợp lệ');
      }
    } catch (error) {
      console.error('Đặt vé thất bại:', error);
      alert('Đặt vé thất bại. Vui lòng thử lại.');
    }

  };

  return (
    <>
      <Header />
      <Headerticket />
      <div className="order-checkout-container">
        <div className="left-panel">
          <div className="order-summary">
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
          <div className="payment-methods">
            <h3>Hình thức thanh toán</h3>
            <ul>
              <li>
                <FontAwesomeIcon icon={faWallet} className="payment-icon" /> Fundiin
              </li>
              <li>
                <FontAwesomeIcon icon={faMobileAlt} className="payment-icon" /> Ví MoMo
              </li>
              <li>
                <FontAwesomeIcon icon={faQrcode} className="payment-icon" /> Quét mã QR
              </li>
              <li>
                <FontAwesomeIcon icon={faUniversity} className="payment-icon" /> Chuyển khoản / Internet Banking
              </li>
              <li>
                <FontAwesomeIcon icon={faWallet} className="payment-icon" /> Ví ShopeePay
              </li>
              <li>
                <FontAwesomeIcon icon={faCreditCard} className="payment-icon" /> Thẻ ATM (Thẻ nội địa)
              </li>
              <li>
                <FontAwesomeIcon icon={faWallet} className="payment-icon" /> Ví FPT Pay
              </li>
            </ul>
          </div>
          <div className="form-container">
            <h3>Thông tin cá nhân</h3>
            <form>
              <div className="form-group">
                <label htmlFor="fullname">Họ và tên</label>
                <input type="text" id="fullname" placeholder="Nhập họ và tên" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Nhập email" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input type="tel" id="phone" placeholder="Nhập số điện thoại" required />
              </div>
              <div className="form-group checkbox-group">
                <input type="checkbox" id="create-account" />
                <label htmlFor="create-account">Tạo tài khoản với email và số điện thoại này</label>
              </div>
            </form>
          </div>
        </div>
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
                Vé đã mua không thể đổi hoặc hoàn tiền. Mã vé sẽ được gửi 01 lần
                qua số điện thoại và email đã nhập. Vui lòng kiểm tra lại thông
                tin trước khi tiếp tục
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
