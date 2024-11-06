import React, { useState } from 'react';
import axios from 'axios';
import './ForgetPass.css';

const Otp = () => {
    const [otp, setOtp] = useState(''); // Trạng thái lưu mã OTP
    const [message, setMessage] = useState('');

    // Hàm xử lý xác minh OTP
    const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/password/verify-otp', {
                otp: otp,
            });
            setMessage('OTP hợp lệ! Bạn có thể tiếp tục.');
        } catch (error) {
            setMessage('OTP không hợp lệ. Vui lòng thử lại.');
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="form-section">
                <h2>Phục hồi mật khẩu</h2>
                <form onSubmit={handleVerifyOtp}>
                    <label htmlFor="otp">OTP</label>
                    <input
                        type="text"
                        id="otp"
                        placeholder="Nhập OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button type="submit">Xác minh OTP</button>
                </form>
                {message && <p>{message}</p>}
            </div>
            <div className="image-section">
                <img src="https://cdn.moveek.com/bundles/ornweb/img/mascot.png" alt="Mascot" />
            </div>
        </div>
    );
};

export default Otp;
