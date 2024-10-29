import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import instance from '../../server';
import { message } from 'antd'; // Import message from Ant Design
import Headerticket from '../Headerticket/Headerticket';
import Footer from '../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faMobileAlt, faQrcode, faUniversity, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import './OderCheckOut.css';
import Header from '../Header/Hearder';

const OrderCheckout = () => {
    const location = useLocation();
    const {
        movieName,
        cinemaName,
        showtime, // Ensure this matches the name from OrderPage
        seats,
        totalPrice,
        showtimeId,
        roomId,
        cinemaId,
        selectedCombos,
    } = location.state || {};

    // Log selectedSeats to verify data
    console.log(seats);
    console.log(selectedCombos); // Check if combos are passed correctly

    // State for payment method
    const [pay_method_id, setPaymentMethod] = useState<number | null>(null); // Khởi tạo pay_method_id với null

    const handleCheckout = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        if (!token) {
            message.warning("Vui lòng đăng nhập trước khi đặt vé.");
            return;
        }

        if (!cinemaId || !showtimeId || !userId) {
            message.warning("Thông tin không đầy đủ. Vui lòng kiểm tra lại.");
            return;
        }

        if (!Array.isArray(seats) || seats.length === 0) {
            message.warning("Vui lòng chọn ghế ngồi.");
            return;
        }

        if (pay_method_id === null) {
            message.warning("Vui lòng chọn phương thức thanh toán.");
            return;
        }

        const seatsData = seats.map((seat: any) => ({
            seat_name: seat.seat_name,
            room_id: roomId,
            showtime_id: showtimeId, // Ensure this matches the name from OrderPage
            seat_row: seat.seat_row,
            seat_column: seat.seat_column,
        }));

        console.log(seatsData);

        const bookingData = {
            cinemaId,
            showtime_id: showtimeId, // Ensure this matches the name from OrderPage
            userId,
            seats: seatsData,
            amount: totalPrice,
            pay_method_id, // Gửi pay_method_id là số nguyên
            comboId: selectedCombos,
        };
        console.log(bookingData);

        try {
            const response = await instance.post("/book-ticket", bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
             
            });

            // if (response.data) {
            //     const redirectUrl = response.data.Url.original.url;
            //     message.success("Đặt vé thành công!");
            //     window.location.href = redirectUrl;
            // } else {
            //     message.error("Có lỗi xảy ra khi đặt vé.");
            // }
        } catch (error) {
            message.error("Có lỗi xảy ra khi đặt vé.");
            console.error("Error during booking:", error);
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
                            <span className="item-title">Ghế đã chọn: {seats.map(seat => seat.seat_name).join(', ')}</span>
                        </div>
                        {/* Hiển thị combo nếu có */}
                        {selectedCombos && selectedCombos.length > 0 && (
                            <div className="combo-summary">
                                <h4>Combo đã chọn:</h4>
                                {selectedCombos.map((combo: any, index: number) => (
                                    <div key={index} className="order-item">
                                        <span className="item-title">Combo: {combo.combo_name}</span>
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
                        <ul>
                            <li onClick={() => { setPaymentMethod(1); console.log('Phương thức thanh toán đã được chọn: VN Pay'); }}>
                                <FontAwesomeIcon icon={faWallet} className="payment-icon" /> VN Pay
                            </li>
                            <li onClick={() => { setPaymentMethod(2); console.log('Phương thức thanh toán đã được chọn: MoMo'); }}>
                                <FontAwesomeIcon icon={faMobileAlt} className="payment-icon" /> Ví MoMo
                            </li>
                            <li onClick={() => { setPaymentMethod(3); console.log('Phương thức thanh toán đã được chọn: Quét mã QR'); }}>
                                <FontAwesomeIcon icon={faQrcode} className="payment-icon" /> Quét mã QR
                            </li>
                            <li onClick={() => { setPaymentMethod(4); console.log('Phương thức thanh toán đã được chọn: Chuyển khoản'); }}>
                                <FontAwesomeIcon icon={faUniversity} className="payment-icon" /> Chuyển khoản / Internet Banking
                            </li>
                            <li onClick={() => { setPaymentMethod(5); console.log('Phương thức thanh toán đã được chọn: Ví ShopeePay'); }}>
                                <FontAwesomeIcon icon={faWallet} className="payment-icon" /> Ví ShopeePay
                            </li>
                            <li onClick={() => { setPaymentMethod(6); console.log('Phương thức thanh toán đã được chọn: Thẻ ATM'); }}>
                                <FontAwesomeIcon icon={faCreditCard} className="payment-icon" /> Thẻ ATM (Thẻ nội địa)
                            </li>
                            <li onClick={() => { setPaymentMethod(7); console.log('Phương thức thanh toán đã được chọn: Ví FPT Pay'); }}>
                                <FontAwesomeIcon icon={faWallet} className="payment-icon" /> Ví FPT Pay
                            </li>
                        </ul>
                    </div>

                    {/* Thông tin cá nhân */}
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
                    </div>
                    <div className="confirm-button">
                        <button onClick={handleCheckout}>Xác nhận thanh toán</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderCheckout;