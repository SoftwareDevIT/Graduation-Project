import React from "react";
import "./Login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Đăng nhập</h2>
        <form>
          <div className="form-group">
            <label>Tài khoản</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" />
          </div>
          <div className="form-group">
            <a href="/" className="forgot-password">
              Quên mật khẩu?
            </a>
          </div>
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
          <div className="register-link">
            <p>
              Chưa có tài khoản? <a href="/">Đăng ký ngay!</a>
            </p>
          </div>
        </form>
      </div>
      <div className="login-image">
        <img
          src="https://cdn.moveek.com/bundles/ornweb/img/mascot.png"
          alt="Cartoon Monster"
        />
      </div>
    </div>
  );
}

export default Login;
