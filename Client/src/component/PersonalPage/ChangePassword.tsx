import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, Avatar, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './Profile.css'; // Import file CSS
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
 import './ChangePassword.css'
import { Link, useLocation } from 'react-router-dom';

const { Option } = Select;

const ChangePassword: React.FC = () => {
  const location = useLocation(); // Lấy vị trí hiện tại

  // Xác định URL hiện tại có thuộc nhóm "Tài khoản", "Nạp tiền", ...
  const isAccountActive = location.pathname === '/profile' || location.pathname === '/changepassword';
  const isCreditsActive = location.pathname === '/credits' || location.pathname === '/deponsit' || location.pathname === '/transaction';
    const [avatar, setAvatar] = useState('https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png'); // Khởi tạo giá trị avatar mặc định

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        notification.error({ message: 'Mật khẩu xác minh không trùng khớp!' });
        return;
      }
      // Xử lý logic đổi mật khẩu ở đây
      notification.success({ message: 'Đổi mật khẩu thành công!' });
      // Reset form sau khi đổi mật khẩu
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    };
  

  return (
    <>
      <Header/>
      <div className="banner">
          <img src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png" alt="Banner" className="banner-img" />
        </div>
      <div className="content-acount">
      <div className="container boxcha">
      <div className="profile-fullscreen">
       
       <div className="account-settings-container">
       <div className="account-settings-container">
  <div className="account-avatar">
    <div className="account-info">
      <Avatar size={128} src={avatar} alt="avatar" className="avatar" />
      <div className="account-details">
        <h2 className="account-name">NPTG</h2>
        
      </div>
    </div>

    {/* Thêm menu điều hướng bên dưới avatar */}
    <div className="account-nav">
            <div className={`account-nav-item ${isAccountActive ? 'active' : ''}`}>
                <span className="account-nav-title">Tài khoản</span>
                <ul className="account-submenu">
                    <li className="account-submenu-item">
                        <Link to={'/profile'}>Quản lí tài khoản</Link>
                    </li>
                    <li className="account-submenu-item">
                        <Link to={'/changepassword'}>Đổi mật khẩu</Link>
                    </li>
                </ul>
            </div>

            <div className="account-nav-item">
                <span className="account-nav-title">Tủ phim</span>
            </div>

            <div className="account-nav-item">
                <span className="account-nav-title">Vé</span>
            </div>

            <div className={`account-nav-item ${isCreditsActive ? 'active' : ''}`}>
                <span className="account-nav-title">Nạp tiền</span>
                <ul className="account-submenu">
                    <li className="account-submenu-item">
                        <Link to={'/credits'}>Nạp tiền</Link>
                    </li>
                    <li className="account-submenu-item">
                        <Link to={'/deponsit'}>Lịch sử nạp tiền</Link>
                    </li>
                    <li className="account-submenu-item">
                        <Link to={'/transaction'}>Lịch sử giao dịch</Link>
                    </li>
                </ul>
            </div>
        </div>
  </div>
</div>

</div>
<div className="divider"></div> 
      </div>
    
      <div className="change-password-container">
  <form className="change-password-form" onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="currentPassword">Mật khẩu hiện tại:</label>
      <input
      
        type="password"
        id="currentPassword"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="newPassword">Mật khẩu mới:</label>
      <input
        type="password"
        id="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="confirmPassword">Xác minh:</label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
    </div>

    <button type="submit" className="submit-button">
      Đổi mật khẩu
    </button>
  </form>
</div>

      </div>
      </div>
      
      <Footer />
    </>
  );
};  

export default ChangePassword;
