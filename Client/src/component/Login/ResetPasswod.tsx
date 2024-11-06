import React, { useState } from 'react';
import axios from 'axios';
import './ForgetPass.css';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'antd';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | 'warning' | undefined>(undefined);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if password and confirmation match
        if (password !== passwordConfirmation) {
            setMessage('Mật khẩu và xác nhận mật khẩu không trùng khớp.');
            setMessageType('error');
            return;
        }

        const email = localStorage.getItem('reset_email');
        if (!email) {
            setMessage('Không tìm thấy email trong phiên làm việc.');
            setMessageType('error');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/password/reset', {
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            setMessage('Mật khẩu đã được đặt lại thành công!');
            setMessageType('success');
            localStorage.removeItem('reset_email');
            navigate('/login');
        } catch (error) {
            setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
            setMessageType('error');
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="form-section">
                <h2>Phục hồi mật khẩu</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="password">Mật khẩu mới</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Nhập mật khẩu mới"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Only updates `password`
                        required
                    />
                    <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        id="confirm-password"
                        placeholder="Xác nhận mật khẩu"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)} // Only updates `passwordConfirmation`
                        required
                    />
                    <button type="submit">Đổi Mật Khẩu</button>
                </form>

                {message && (
                    <Alert
                        message={message}
                        type={messageType} // Use messageType for success or error
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

export default ResetPassword;
