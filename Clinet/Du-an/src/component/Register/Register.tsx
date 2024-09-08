import React from "react";
import "./Register.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";

function Register() {
  return (
    <>
      <div className="custom-register-container">
        <div className="custom-register-form">
          <h2>Đăng ký</h2>
          <form>
            <div className="custom-form-group">
              <div className="custom-form-field">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" />
              </div>
              <div className="custom-form-field">
                <label htmlFor="username">Tên đăng nhập:</label>
                <input type="text" id="username" />
              </div>
            </div>
            <div className="custom-form-group">
              <div className="custom-form-field">
                <label htmlFor="password">Mật khẩu:</label>
                <input type="password" id="password" />
              </div>
              <div className="custom-form-field">
                <label htmlFor="confirmPassword">Xác minh:</label>
                <input type="password" id="confirmPassword" />
              </div>
            </div>
            <button type="submit" className="custom-submit-btn">
              Tạo tài khoản
            </button>
          </form>
          <p className="custom-login-link">
            Đã có tài khoản? <a href="/login">Đăng nhập!</a>
          </p>
        </div>
        <div className="custom-image-container">
          <img src="https://cdn.moveek.com/bundles/ornweb/img/mascot.png" alt="Mascot" />
        </div>
      </div>
    </>
  );
}

export default Register;
