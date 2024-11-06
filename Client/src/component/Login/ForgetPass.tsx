import React, { useState } from 'react';
import axios from 'axios';
import './ForgetPass.css';
import { useNavigate } from 'react-router-dom';

const ForgetPass = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
const nav=useNavigate()
    // Chỉ định kiểu cho tham số e
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/password/send-otp', {
                email: email,
            });
            
            setMessage('Mã OTP đã được gửi đến email của bạn.');
            nav('/otp')
        } catch (error) {
            setMessage('Đã xảy ra lỗi. Vui lòng kiểm tra lại email của bạn.');
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="form-section">
                <h2>Phục hồi mật khẩu</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Tài khoản</label>
                    <input
                        type="email"
                        id="username"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Quên mật khẩu</button>
                </form>
                {message && <p>{message}</p>}
            </div>
            <div className="image-section">
                <img src="https://cdn.moveek.com/bundles/ornweb/img/mascot.png" alt="Mascot" />
            </div>
        </div>
    );
};

export default ForgetPass;
