import React, { useState } from 'react';
import axios from 'axios';
import './ForgetPass.css';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'antd';

const ForgetPass = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | 'warning' | undefined>(undefined);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate if email is not empty
        if (!email.trim()) {
            setMessage('Vui lòng nhập email.');
            setMessageType('error');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/password/send-otp', { email });
            
            // Store email in localStorage
            localStorage.setItem('reset_email', email);
            setMessage('Mã OTP đã được gửi đến email của bạn.');
            setMessageType('success');
            navigate('/otp');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const serverMessage = error.response.data?.message;
                if (serverMessage === 'Không tìm thấy người dùng với email này.') {
                    setMessage('Tài khoản không tồn tại.');
                } else {
                    setMessage('Đã xảy ra lỗi. Vui lòng kiểm tra lại email của bạn.');
                }
            } else {
                setMessage('Đã xảy ra lỗi không xác định.');
            }
            setMessageType('error');
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="form-section">
                <h2>Phục hồi mật khẩu</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Tài khoản</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Quên mật khẩu</button>
                </form>
                
                {message && (
                    <Alert
                        message={message}
                        type={messageType}
                        showIcon
                        style={{ marginTop: '15px' }}
                    />
                )}
            </div>
            <div className="image-section">
                <img src="https://cdn.moveek.com/bundles/ornweb/img/mascot.png" alt="Mascot" />
            </div>
        </div>
    );
};

export default ForgetPass;
