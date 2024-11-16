import React, { useEffect, useState } from 'react';
import { Form, Input, notification, Avatar } from 'antd';
import './Profile.css'; 
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import './ChangePassword.css';
import { NavLink } from 'react-router-dom';
import instance from '../../server';

const ChangePassword: React.FC = () => {
  const [avatar, setAvatar] = useState('https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const profileData = localStorage.getItem("user_profile");
    if (profileData) {
      const profile = JSON.parse(profileData);
      const userId = profile.id;

      const fetchUserProfile = async () => {
        try {
          const response = await instance.get(`/user/${userId}`);
          if (response.data.status) {
            setUserProfile(response.data.data);
            setAvatar(response.data.data.avatar || "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      notification.error({ message: 'Mật khẩu xác minh không trùng khớp!' });
      return;
    }

    try {
      const response = await instance.post('/resetPassword', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      
      if (response.data.message) {
        notification.success({ message: 'Đổi mật khẩu thành công!' });
      } else {
        notification.error({ message: response.data.message || 'Cập nhật mật khẩu thất bại' });
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        notification.error({ message: 'Mật khẩu hiện tại không chính xác.' });
      } else {
        notification.error({ message: error.response?.data?.message || 'Cập nhật mật khẩu thất bại' });
      }
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <Header />
      <div className="banner">
        <img src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png" alt="Banner" className="banner-img" />
      </div>
     <div className="container">
     <div className="content-acount1">
        <div className="container boxcha">
          <div className="profile-fullscreen">
            <div className="account-settings-container">
              <div className="account-avatar">
                <div className="account-info fix-acount">
                  <Avatar size={128} src={avatar} alt="avatar" className="avatar" />
                  <div className="account-details">
                    <h2 className="account-name">
                      {userProfile?.user_name || "No name"}
                    </h2>
                  </div>
                </div>

                <div className="account-nav">
      <div className="account-nav-item">
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `account-nav-title ${isActive || location.pathname === '/changepassword' ? 'active' : ''}`}
        >
          Tài khoản
        </NavLink>
        <ul className="account-submenu">
          <li className="account-submenu-item">
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Quản lí tài khoản</NavLink>
          </li>
          <li className="account-submenu-item">
            <NavLink to="/changepassword" className={({ isActive }) => (isActive ? 'active' : '')}>Đổi mật khẩu</NavLink>
          </li>
        </ul>
      </div>

      <div className="account-nav-item">
        <NavLink 
          to="/movie-library" 
          className={({ isActive }) => `account-nav-title ${isActive ? 'active' : ''}`}
        >
          Tủ phim
        </NavLink>
      </div>

      <div className="account-nav-item">
        <NavLink 
          to="/tickets" 
          className={({ isActive }) => `account-nav-title ${isActive ? 'active' : ''}`}
        >
          Vé
        </NavLink>
      </div>

      <div className="account-nav-item">
        <NavLink 
          to="/credits" 
          className={({ isActive }) => `account-nav-title ${['/credits', '/deponsit', '/transaction'].includes(location.pathname) ? 'active' : ''}`}
        >
          Nạp tiền
        </NavLink>
        <ul className="account-submenu">
          <li className="account-submenu-item">
            <NavLink to="/credits" className={({ isActive }) => (isActive ? 'active' : '')}>Nạp tiền</NavLink>
          </li>
          <li className="account-submenu-item">
            <NavLink to="/deponsit" className={({ isActive }) => (isActive ? 'active' : '')}>Lịch sử nạp tiền</NavLink>
          </li>
          <li className="account-submenu-item">
            <NavLink to="/transaction" className={({ isActive }) => (isActive ? 'active' : '')}>Lịch sử giao dịch</NavLink>
          </li>
        </ul>
      </div>
    </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>

          <div className="change-password-container">
            <form className="change-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Mật khẩu hiện tại:</label>
                <Input.Password
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Mật khẩu mới:</label>
                <Input.Password
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác minh:</label>
                <Input.Password
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
     </div>
      <Footer />
    </>
  );
};

export default ChangePassword;
