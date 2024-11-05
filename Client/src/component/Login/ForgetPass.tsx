import React from 'react';
import './ForgetPass.css';

const ForgetPass = () => (
    
    <div className="forgot-password-container">
        <div className="form-section">
            <h2>Phục hồi mật khẩu</h2>
            <label htmlFor="username">Tài khoản</label>
            <input type="text" id="username" placeholder="Nhập tài khoản của bạn" />
            <button >Quên mật khẩu</button>
        </div>
        <div className="image-section">
            <img src="https://cdn.moveek.com/bundles/ornweb/img/mascot.png" alt="Mascot" />
        </div>
    </div>
);

export default ForgetPass;
