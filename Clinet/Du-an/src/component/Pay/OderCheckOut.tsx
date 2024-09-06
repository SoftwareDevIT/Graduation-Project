import React from 'react';
import './OderCheckOut.css';
import Header from '../Header/Hearder';
import Footer from '../Footer/Footer';
import Headerticket from '../Headerticket/Headerticket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyCheckAlt, faQrcode, faMobileAlt, faUniversity, faWallet } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard, faCcJcb } from '@fortawesome/free-brands-svg-icons';

const OrderCheckout = () => {
  return (
    <>
      <Header />
      <Headerticket />
      <div className="order-checkout-container">
        {/* Left Panel */}
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
              <span className="item-title">Ghế Đơn</span>
              <span className="item-quantity">1</span>
              <span className="item-price">45,000 đ</span>
            </div>
            <div className="order-item">
              <span className="item-title">Phí tiện ích</span>
              <span className="item-price">2,500 đ</span>
            </div>
            <div className="order-total">
              <span className="total-title">Tổng</span>
              <span className="total-price">47,500 đ</span>
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
      <FontAwesomeIcon icon={faCcVisa} className="payment-icon" /> Thẻ Visa, Master, JCB
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
                <input type="text" id="fullname" placeholder="Nhập họ và tên" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Nhập email" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input type="tel" id="phone" placeholder="Nhập số điện thoại" />
              </div>
              <div className="form-group checkbox-group">
                <input type="checkbox" id="create-account" />
                <label htmlFor="create-account">Tạo tài khoản với email và số điện thoại này</label>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <div className="checkout-details">
            <div className="order-info">
              <span className="total-title">Tổng đơn hàng</span>
              <h2 className="total-price">47,500 đ</h2>
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
            <button className="checkout-button">Thanh toán</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderCheckout;


